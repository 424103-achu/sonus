import { HomeIcon } from "lucide-react";
import { User2, Search } from "lucide-react";
import { useState } from "react";
import IconLink from "./iconlink";
function Navbar() {
  const [expanded, setExpanded] = useState(false);
  const [username, setusername] = useState("");
  const searchusername=(e)=>{
    e.preventDefault();
    console.log(username);
  }
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
        <IconLink to="/home" icon={HomeIcon} label="Home" />
            <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`
        flex flex-row-reverse items-center
        rounded-full
        transition-all duration-300
        overflow-hidden
        ${expanded ? "w-64 px-4 bg-white/10 backdrop-blur" : "w-8"}
      `}
    >
      {/* Icon (Always visible) */}
      <Search
        className={`
          w-6 h-6 shrink-0
          transition-colors duration-300
          ${expanded ? "text-white" : "text-zinc-400"}
        `}
      />

      {/* Expanding Input */}
      <input
        type="text"
        onChange={(e)=>{
            setusername(e.target.value);
        }}
        onSubmit={searchusername}
        placeholder="Search..."
        className={`
          bg-transparent outline-none text-sm text-white
          transition-all duration-300
          ${expanded ? "opacity-100 w-full mr-3 h-10" : "opacity-0 w-0"}
        `}

      />
    </div>

        <IconLink to="/profile" icon={User2} label="Profile" />
      </nav>
    </div>
  );
}

export default Navbar;
