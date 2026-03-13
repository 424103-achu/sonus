import { HomeIcon } from "lucide-react";
import { User2, Search } from "lucide-react";
import IconLink from "./iconlink";
import { useState, useEffect } from "react";
import { searchUsers } from "../../../services/userService";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const navigate = useNavigate();

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
      <nav className="flex gap-8 text-sm text-zinc-400 relative">

        <IconLink to="/home" icon={HomeIcon} label="Home" />

        {/* SEARCH */}
        <div
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
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

            <div className="absolute top-12 right-0 w-64 bg-[#0b0b0d] border border-white/10 rounded-lg shadow-xl">

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
                      onClick={() => navigate(`/profile/${u.user_id}`)}
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

      </nav>

    </div>
  );
}

export default Navbar;