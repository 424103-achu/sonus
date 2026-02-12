import React, { useState } from "react";
import Button from "../components/button.jsx";
import { Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
function Login() {
  const [usnm, setUsername] = useState("");
  const [pswd, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@((student\.nitandhra\.ac\.in)|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;
  const userRegex = /^[a-zA-Z0-9._]{3,20}$/;
  const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  const LoginAction = (e) => {
    e.preventDefault();
    if (!emailRegex.test(usnm) && !userRegex.test(usnm)) {
      setError("Enter a valid email or username");
      setPassword("");
      return;
    }
    if (!passRegex.test(pswd)) {
      setError("Enter valid password");
      setPassword("");
      return;
    }
    setError("");
    console.log("Login OK:", { usnm, pswd });
    setUsername("");
    setPassword("");
  };
  return (
    <div className="w-screen h-screen bg-[#0b0b0d] text-white relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full flex justify-between 
               items-center px-[4%] py-[2%] z-20"
      >
        <div className="text-4xl  font-semibold tracking-wide text-white-400/80" style={{ fontFamily: "Sour Gummy" }}>
          Sonus
        </div>
        <div className="flex gap-8 text-gray-400">
          <nav className="ml-auto flex gap-8 text-sm">
            <Link to="/" className="text-zinc-400 hover:text-white transition">
              Home
            </Link>
            <Link
              to="/signup"
              className="text-zinc-400 hover:text-white transition"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </div>
      <div className="absolute -top-[15%] -left-[15%] w-[50%] h-[50%] bg-red-600/20 blur-[20vw]" />
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-red-700/10 blur-[18vw]" />
      <div className="relative z-10 w-full h-full flex justify-center items-center">
        <div className="w-full max-w-350 h-full flex">
          <div className="hidden lg:flex w-1/2 flex-col justify-center px-[8%]">
            <h1 className="font-semibold mb-4 text-[clamp(2.5rem,3vw,3.5rem)]">
              Welcome
            </h1>
            <p className="text-gray-400 max-w-md text-[clamp(1rem,1.1vw,1.2rem)]">
              Your private space for photos, videos, and life moments — exactly
              where you left them.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center items-center px-6">
            <form
              onSubmit={LoginAction}
              className="w-full max-w-105 p-8 rounded-2xl bg-[#141417]/80 backdrop-blur
                         border border-white/5 shadow-2xl"
            >
              <h1 className=" text-2xl text-center font-semibold mb-10 ">
                Log into your account 
              </h1>
              <label className="text-gray-400 text-sm">Username or Email</label>
              <input
                value={usnm}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                className="w-full mt-2 mb-5 px-4 py-3 rounded-lg
                           bg-black/40 border border-white/10
                           focus:border-red-500 focus:outline-none"
                placeholder="Enter email or username"
              />
              <label className="text-gray-400 text-sm">Password</label>

              <div className="relative mt-2 mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  value={pswd}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 pr-14 rounded-lg bg-black/40 border border-white/10
               focus:border-red-500 focus:outline-none"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 "
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-center">
                <Button type="submit">Sign in</Button>
              </div>
              {error && (
                <div className="mt-4 text-red-500 text-sm text-center">
                  {error}
                </div>
              )}
              <div className="mt-6 text-left text-gray-500">
                <span className="hover:text-red-500 cursor-pointer">
                  Forgot password
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
