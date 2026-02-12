import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./signup_page.css";
import Button from "../components/button";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
function Signup() {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@((student\.nitandhra\.ac\.in)|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;
  const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  const [result, setresult] = useState(0);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    axios
      .get("http://localhost:5000/signup")
      .then((res) => {
        console.log(res.data); // see full response

        // 👇 extract result from array
        setresult(res.data[0].result);
      })
      .catch((err) => console.error(err));
  }, []);
  const [showPassword, setShowPassword] = useState(false);
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
      "Password must contain 8+ chars, uppercase, lowercase, number & special character"
    );
    return;
  }

  setError("");
  console.log("Signup data:", formData);
};


  return (
    <div className="w-screen h-screen bg-[#0b0b0d] text-white relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full flex justify-between 
               items-center px-[4%] py-[2%] z-20"
      >
        <div
          className="text-4xl font-semibold tracking-wide text-white-400/80 "
          style={{ fontFamily: "Sour Gummy" }}
        >
          Sonus
        </div>
        <div className="flex gap-8 text-gray-400">
          <nav className="ml-auto flex gap-8 text-sm">
            <Link to="/" className="text-zinc-400 hover:text-white transition">
              Home
            </Link>
            <Link
              to="/login"
              className="text-zinc-400 hover:text-white transition"
            >
              Sign in
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
              onSubmit={handleSubmit}
              className="w-full max-w-105 p-8 rounded-2xl bg-[#141417]/80 backdrop-blur
                         border border-white/5 shadow-2xl"
            >
              <h1 className=" text-2xl text-center font-semibold mb-10 ">
                Create an account
              </h1>
              <h1 className=" text-2xl text-center font-semibold mb-10 ">
                Result :{result}
              </h1>
              <input
                id="email"
                value={formData.email}
                className="w-full mt-2 mb-5 px-4 py-3 rounded-lg
                           bg-black/40 border border-white/10
                           focus:border-red-500 focus:outline-none"
                placeholder="Email "
                onChange={handleChange}
              />

              <input
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-2 mb-5 px-4 py-3 rounded-lg
                           bg-black/40 border border-white/10
                           focus:border-red-500 focus:outline-none"
                placeholder="Name"
              />
              <div className="relative mt-2 mb-6">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-14 rounded-lg bg-black/40 border border-white/10
               focus:border-red-500 focus:outline-none"
                  placeholder="Password"
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
                <Button type="submit">Sign up</Button>
              </div>
              {error && (
                <div className="mt-4 text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="mt-6 text-left text-gray-500">
                <p className="text-xs text-zinc-400 text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="text-white hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Signup;
