import { Link } from "react-router-dom";


function IconLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="relative flex items-center justify-center group"
    >
      {/* Icon */}
      <Icon className="w-6 h-6 text-zinc-400 group-hover:text-white transition" />

      {/* Hover Label */}
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
        {label}
      </span>
    </Link>
  );
}

export default IconLink;
