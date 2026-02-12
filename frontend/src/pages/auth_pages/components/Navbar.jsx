import { Link } from "react-router-dom";

function Navbar({ links = [] }) {
  return (
    <div className="absolute top-0 left-0 w-full flex justify-between items-center px-[4%] py-[2%] z-20">
      
      {/* Logo */}
      <div
        className="text-4xl font-semibold tracking-wide"
        style={{ fontFamily: "Sour Gummy" }}
      >
        Sonus
      </div>

      {/* Navigation Links */}
      <nav className="flex gap-8 text-sm text-zinc-400">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="hover:text-white transition"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Navbar;
