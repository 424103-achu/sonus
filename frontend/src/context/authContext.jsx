import { createContext, useState, useEffect } from "react";
import * as authService from "../services/authService";
import * as userService from "../services/userService";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);   // ← THIS MUST EXIST

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    userService.getCurrentUser()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => {
        setLoading(false);
      });

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

  const logout = () => {

    localStorage.removeItem("token");
    setUser(null);

  };

  const refreshUser = async () => {

    try {

      const data = await userService.getCurrentUser();
      setUser(data);

    } catch {

      logout();

    }

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