import { HomeIcon, LogOut } from "lucide-react";
import { User2, Search } from "lucide-react";
import IconLink from "./iconlink";
import { useState, useEffect, useRef } from "react";
import { searchUsers } from "../../../services/userService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

function Navbar() {

  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { logout } = useAuth();

  const navigate = useNavigate();
  const leaveTimerRef = useRef(null);

  const handleUserClick = (userId) => {
    setSearch("");
    setResults([]);
    setExpanded(false);
    navigate(`/view-home/${userId}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleMouseEnter = () => {
    clearTimeout(leaveTimerRef.current);
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setExpanded(false);
      setSearch("");
      setResults([]);
    }, 150);
  };

  useEffect(() => {

    const timer = setTimeout(async () => {

      if (!search) {
        setResults([]);
        return;
      }

      try {

        const users = await searchUsers(search);
        setResults(users);

      } catch (err) {

        console.error(err);

      }

    }, 300);

    return () => clearTimeout(timer);

  }, [search]);

  return (
    <div className="absolute top-0 left-0 w-full flex justify-between items-center px-[4%] py-[2%] z-20">

      {/* Logo */}
      <div
        className="text-4xl font-semibold tracking-wide"
        style={{ fontFamily: "Sour Gummy" }}
      >
        Sonus
      </div>

      {/* Navigation */}
      <nav className="flex gap-8 text-sm text-zinc-400 items-center relative">

        <IconLink to="/home" icon={HomeIcon} label="Home" />

        {/* SEARCH */}
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`
            flex flex-row-reverse items-center
            rounded-full
            transition-all duration-300
            overflow-visible
            relative
            ${expanded ? "w-64 px-4 bg-white/10 backdrop-blur" : "w-8"}
          `}
        >

          <Search
            className={`
              w-6 h-6 shrink-0
              transition-colors duration-300
              ${expanded ? "text-white" : "text-zinc-400"}
            `}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className={`
              bg-transparent outline-none text-sm text-white
              transition-all duration-300
              ${expanded ? "opacity-100 w-full mr-3 h-10" : "opacity-0 w-0"}
            `}
          />

          {/* SEARCH RESULTS */}
          {expanded && search && (

            <div className="absolute top-12 right-0 w-64 bg-[#0b0b0d] border border-white/10 rounded-lg shadow-xl" onMouseEnter={handleMouseEnter}>

              {results.length === 0 ? (

                <p className="p-4 text-gray-400 text-sm">
                  User not found
                </p>

              ) : (

                results.map((u) => {

                  const initials =
                    (u.first_name?.[0] || "") +
                    (u.last_name?.[0] || "") ||
                    u.username[0];

                  return (

                    <div
                      key={u.user_id}
                      onClick={() => handleUserClick(u.user_id)}
                      className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer"
                    >

                      <img
                        src={`https://ui-avatars.com/api/?name=${initials}&background=0b0b0d&color=fff`}
                        className="w-9 h-9 rounded-full border border-red-600"
                      />

                      <div>

                        <p className="text-sm font-semibold text-white">
                          {u.username}
                        </p>

                        <p className="text-xs text-gray-400">
                          {u.first_name} {u.last_name}
                        </p>

                      </div>

                    </div>

                  );

                })

              )}

            </div>

          )}

        </div>

        <IconLink to="/profile" icon={User2} label="Profile" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="relative flex items-center justify-center group"
          title="Logout"
        >
          <LogOut className="w-6 h-6 text-zinc-400 group-hover:text-red-500 transition" />
          <span
            className="
              absolute left-1/2 -translate-x-1/2 top-10
              px-2 py-1 text-xs rounded-md
              bg-black text-white
              opacity-0 translate-y-2
              group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-200
              whitespace-nowrap
            "
          >
            Logout
          </span>
        </button>

      </nav>

    </div>
  );
}

export default Navbar;