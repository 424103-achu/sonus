import { Link } from "react-router-dom";
import Button from "../../components/button";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "../../index.css";

function Home() {
  return (
    <div className="w-full min-h-full bg-[#0b0b0d] text-white relative overflow-x-hidden">
      {/* ================= NAVBAR ================= */}
      <Navbar
        links={[
          { name: "Sign in", path: "/login" },
          { name: "Sign up", path: "/signup" },
        ]}
      />

      {/* ================= GLOW BACKGROUND ================= */}
      <div className="absolute -top-[15%] -left-[15%] w-[50%] h-[50%] bg-red-600/20 blur-[20vw] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-red-700/10 blur-[18vw] pointer-events-none" />

      {/* ================= HERO ================= */}
      <div className="relative z-10 w-full min-h-screen flex flex-col min-[820px]:flex-row">
        {/* LEFT SIDE */}
        <div className="w-full min-[820px]:w-1/2 flex flex-col justify-center px-[8%] py-24 min-[820px]:py-0">
          <h1
            className="
              font-semibold mb-6 leading-tight
              text-[2rem]
              min-[360px]:text-[2.3rem]
              min-[115px]:text-[clamp(2.5rem,5vw,3rem)]
            "
          >
            Build Your Identity.
            <br />
            Connect Your World.
          </h1>

          <p className="text-gray-400 text-[clamp(1rem,1.1vw,1.2rem)] max-w-md leading-relaxed">
            A structured portfolio meets real-time social networking. Designed
            for expression. Built for connection.
            <br />
            <br />
            Your private space for photos, videos, and life moments — exactly
            where you left them.
          </p>

          <div className="mt-10 space-y-3 text-zinc-300 text-sm tracking-wide">
            <p>Structured Profiles</p>
            <p>Personal Comfort Zone</p>
            <p>Smart Friend Connections</p>
            <p>Instant Real-Time Chat</p>
          </div>

          {/* MOBILE CARD (<820px) */}
          <div className="mt-12 min-[820px]:hidden w-full">
            <div className="w-full p-8 rounded-3xl bg-[#141417]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(255,0,0,0.06)] flex flex-col items-center text-center">
              <span className="text-xs tracking-widest text-red-400 uppercase mb-4">
                Get Started
              </span>

              <h2 className="text-xl font-semibold mb-3">
                Create Your Digital Space
              </h2>

              <p className="text-zinc-400 text-sm mb-6 leading-relaxed max-w-xs">
                Everything you are. Everything you love. All structured. All
                connected.
              </p>

              <Link to="/signup" className="w-full">
                <Button>Sign Up For Free</Button>
              </Link>

              <div className="flex items-center gap-4 w-full my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-zinc-500 tracking-wider">OR</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <p className="text-sm text-zinc-500 mb-3">
                Already have an account?
              </p>

              <Link to="/login" className="w-full">
                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition duration-300 text-zinc-300">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* DESKTOP RIGHT CARD (≥820px) */}
        <div className="hidden min-[820px]:flex min-[820px]:w-1/2 justify-center items-center px-6">
          <div className="w-full max-w-md min-h-130 flex flex-col justify-center items-center text-center p-12 rounded-3xl bg-[#141417]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(255,0,0,0.08)]">
            <span className="text-xs tracking-widest text-red-400 uppercase mb-6">
              Get Started
            </span>

            <h2 className="text-2xl font-semibold mb-4 leading-snug">
              Create Your Digital Space
            </h2>

            <p className="text-zinc-400 mb-10 leading-relaxed text-sm max-w-xs">
              Everything you are. Everything you love. All structured. All
              connected.
            </p>

            <Link to="/signup" className="w-full">
              <Button>Sign Up For Free</Button>
            </Link>

            <div className="flex items-center gap-4 w-full my-8">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-zinc-500 tracking-wider">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <p className="text-sm text-zinc-500 mb-4">
              Already have an account?
            </p>

            <Link to="/login" className="w-full">
              <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition duration-300 text-zinc-300">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
