import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Pwdfield({ id, placeholder, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-4/5 self-center mb-6 h-10">
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
        px-4
          h-10 w-full
          text-white
          bg-black/60
          rounded-2xl
          outline-none
          border border-zinc-700
          placeholder:text-zinc-500
          focus:border-red-500 focus:outline-none 
        "
        required
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="
          absolute right-3 top-1/2
          -translate-y-1/2
          text-zinc-400
          hover:text-red-600
          transition
        "
      >
        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
      </button>
    </div>
  );
}

export default Pwdfield;
