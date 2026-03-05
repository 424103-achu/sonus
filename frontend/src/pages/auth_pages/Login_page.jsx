import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Button from "../../components/button";
import "../../index.css";

function Login() {
  const [usnm, setUsername] = useState("");
  const [pswd, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate();
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@((student\.nitandhra\.ac\.in)|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;
  const userRegex = /^[a-zA-Z0-9._]{3,20}$/;
  const passRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailRegex.test(usnm) && !userRegex.test(usnm)) {
      setError("Enter a valid email or username");
      return;
    }

    if (!passRegex.test(pswd)) {
      setError("Enter valid password");
      return;
    }

    setError("");
    console.log("Login OK:", { usnm, pswd });
    navigate("/profile");
    
  };

  return (
    <div className="w-full min-h-full bg-[#0b0b0d] text-white relative overflow-hidden">
      {/* Decorative Blur Background */}
      <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-red-600/20 blur-[25vw]" />
      <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-red-700/10 blur-[20vw]" />

      {/* Navbar */}
      <Navbar
        links={[
          { name: "Home", path: "/" },
          { name: "Sign Up", path: "/signup" },
        ]}
      />

      {/* Main Layout */}
      <div className="w-full relative z-10 flex flex-col min-[820px]:flex-row justify-center items-center min-h-screen pt-20">
        <div className="w-full min-[820px]:w-1/2 flex justify-center items-center px-6 py-12">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-8 rounded-2xl bg-[#141417]/80 backdrop-blur
                       border border-white/5 shadow-2xl"
          >
            <h1 className=" max-[355px]:text-xl text-2xl text-center font-semibold mb-8">
              Log into your account
            </h1>

            {/* Username / Email */}
            <input
              value={usnm}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="Username or Email"
              className="w-full mb-5 px-4 py-3 rounded-lg
                         bg-black/40 border border-white/10
                         focus:border-red-500 focus:outline-none"
            />

            {/* Password */}
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                value={pswd}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Password"
                className="w-full px-4 py-3 pr-14 rounded-lg
                           bg-black/40 border border-white/10
                           focus:border-red-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex justify-center">
              <Button type="submit">Login</Button>
            </div>

            {error && (
              <div className="mt-4 text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <p className="text-xs text-zinc-400 text-center mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-white hover:underline">
                Sign up
              </Link>
            </p>

            <div className="mt-4 text-center text-gray-500 text-sm hover:text-red-500 cursor-pointer">
              Forgot password?
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;
