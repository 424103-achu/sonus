import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Button from "../../components/button";
import "../../index.css";
import { useAuth } from "../../hooks/useAuth";

function Login() {

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      setError("Username/email and password required");
      return;
    }

    try {
      setError("");
      await login(identifier, password);
      navigate("/profile");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed";
    
      setError(msg);
    }
  };

  return (
    <div className="w-full min-h-full bg-[#0b0b0d] text-white relative overflow-hidden">

      {/* Navbar */}
      <Navbar
        links={[
          { name: "Home", path: "/" },
          { name: "Sign Up", path: "/signup" },
        ]}
      />

      {/* Layout */}
      <div className="w-full relative z-10 flex flex-col min-[820px]:flex-row justify-center items-center min-h-screen pt-20">

        <div className="w-full min-[820px]:w-1/2 flex justify-center items-center px-6 py-12">

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-8 rounded-2xl bg-[#141417]/80 backdrop-blur border border-white/5 shadow-2xl"
          >

            <h1 className="text-2xl text-center font-semibold mb-8">
              Log into your account
            </h1>

            {/* Username / Email */}
            <input
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setError("");
              }}
              placeholder="Username or Email"
              className="w-full mb-5 px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-red-500 focus:outline-none"
            />

            {/* Password */}
            <div className="relative mb-6">

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Password"
                className="w-full px-4 py-3 pr-14 rounded-lg bg-black/40 border border-white/10 focus:border-red-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>

            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <Button type="submit">Login</Button>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            {/* Link */}
            <p className="text-xs text-zinc-400 text-center mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-white hover:underline">
                Sign up
              </Link>
            </p>

          </form>

        </div>
      </div>

      <Footer />

    </div>
  );
}

export default Login;