import { Link } from "react-router-dom";

function Footer({ links = [] }) {
  return (
    <footer className="w-full bg-[#0f0f12] border-t border-white/5 text-zinc-400 ">
      <div className="max-w-full mx-auto px-6 py-10 flex flex-col  md:flex-row justify-center items-center gap-6">
        {/* Logo */}
        <div
          className="text-2xl font-semibold tracking-wide text-white"
          style={{ fontFamily: "Sour Gummy" }}
        >
          Sonus
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-xs text-zinc-500 pb-6">
        © {new Date().getFullYear()} Sonus. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
