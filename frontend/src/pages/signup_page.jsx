import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./signup_page.css"
import Button from "../components/button";
import Pwdfield from "../components/passwordfield";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validate();
    console.log("Signup data:", formData);
  };

  return (
    <div className="min-h-screen w-screen bg-black text-white flex flex-col">
      {/* ================= APP BAR ================= */}
      <header className="h-16 px-8 flex items-center ">
        <h1 className="text-xl font-['Sour_Gummy']  tracking-wide text-red-400">
          SONUS
        </h1>

        <nav className="ml-auto flex gap-8 text-sm">
          <Link to="/" className="text-zinc-400 hover:text-white transition">
            Home
          </Link>
          <Link to="/login" className="text-zinc-400 hover:text-white transition">
            Sign in
          </Link>
        </nav>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex flex-1 items-center justify-center  ">
        <div className="flex w-full  max-w-6xl gap-60">
          {/* LEFT – About */}
          <section className="w-full  px-20 flex m-0 bg-amber-100 flex-col justify-center gap-6">
            <h1 className="text-4xl font-bold leading-tight">
              Build your presence.
              <br />
              Connect through sound.
            </h1>

            <p className="text-zinc-300 max-w-md leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <span className="text-zinc-500 text-sm">
              Trusted by creators worldwide
            </span>
          </section>

          {/* RIGHT – Signup */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md p-8 bg-zinc-900/60 backdrop-blur-xl
                       rounded-2xl border border-zinc-800
                       flex flex-col items-center gap-6"
          >
            <h2 className="text-2xl font-semibold">
              Create Account
            </h2>

            <input
              id="email"
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-10 w-4/5 px-4 mt-4 bg-black/60 rounded-2xl
                         border border-zinc-700
                         placeholder:text-zinc-500
                         focus:border-red-500 focus:outline-none"
            />

            <Pwdfield
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <Button type="submit" className="h-11 mt-2 w-4/5">
              Sign Up
            </Button>

            <p className="text-xs text-zinc-400 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-white hover:underline">
                Log in
              </Link>
            </p>
          </motion.form>
        </div>
      </main>
    </div>
  );
}

export default Signup;
