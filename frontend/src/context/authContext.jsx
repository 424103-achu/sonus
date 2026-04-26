import { useCallback, useEffect, useState } from "react";
import * as authService from "../services/authService";
import * as userService from "../services/userService";
import { AuthContext } from "./AuthContext";
import { closeRealtimeSocket } from "../realtime/socket";

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));

  const logout = useCallback(() => {

    localStorage.removeItem("token");
    setUser(null);
    closeRealtimeSocket();

  }, []);

  const refreshUser = useCallback(async () => {

    try {

      const data = await userService.getCurrentUser();
      setUser(data);

    } catch {

      logout();

    }

  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    let isMounted = true;

    userService.getCurrentUser()
      .then((data) => {
        if (isMounted) {
          setUser(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          localStorage.removeItem("token");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };

  }, []);

  const login = async (identifier, password) => {

    const data = await authService.login(identifier, password);

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data;

  };

  const register = async (username, email, password) => {

    const data = await authService.register(username, email, password);

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data;

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};