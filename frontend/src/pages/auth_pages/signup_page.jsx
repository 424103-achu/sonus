import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../index.css"
import Button from "../../components/button";
import Navbar from "./components/Navbar";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Footer from "./components/Footer";

function Signup() {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@((student\.nitandhra\.ac\.in)|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;
  const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const [result, setresult] = useState(0);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/signup")
      .then((res) => {
        setresult(res.data[0].result);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setError("");
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailRegex.test(formData.email)) {
      setError("Enter a valid email");
      return;
    }

    if (!passRegex.test(formData.password)) {
      setError(
        "Password must contain 8+ chars, uppercase, lowercase, number & special character",
      );
      return;
    }

    console.log("Signup data:", formData);
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
          { name: "Sign in", path: "/login" },
        ]}
      />

      {/* Main Layout */}
      <div className="  w-full relative z-10 flex flex-col min-[820px]:flex-row justify-center items-center min-h-screen pt-20">

        {/* RIGHT SIDE (Form Box) */}
        <div className="w-full min-[820px]:w-1/2 flex justify-center items-center px-6 py-12">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-8 rounded-2xl bg-[#141417]/80 backdrop-blur
                       border border-white/5 shadow-2xl"
          >
            <h1 className="text-2xl text-center font-semibold mb-8">
              Create an account
            </h1>

            <p className="text-center text-sm text-gray-400 mb-6">
              Result: {result}
            </p>

            {/* Email */}
            <input
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full mb-5 px-4 py-3 rounded-lg
                         bg-black/40 border border-white/10
                         focus:border-red-500 focus:outline-none"
            />

            {/* Name */}
            <input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full mb-5 px-4 py-3 rounded-lg
                         bg-black/40 border border-white/10
                         focus:border-red-500 focus:outline-none"
            />

            {/* Password */}
            <div className="relative mb-6">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
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
              <Button type="submit">Sign up</Button>
            </div>

            {error && (
              <div className="mt-4 text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <p className="text-xs text-zinc-400 text-center mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-white hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Signup;
