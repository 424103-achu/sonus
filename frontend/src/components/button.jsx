import { motion } from "framer-motion";

function Button({ children, onClick,onSubmit,type }) {
  const MotionButton = motion.button;

  return (
    <MotionButton
      type={type}
      onClick={onClick}
      onSubmit={onSubmit}
      className="bg-red-500 text-white text-xl rounded-xl w-full px-4 py-2 "
      whileHover={{ scale: 1.04}}
      whileTap={{ scale: 0.99999 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </MotionButton>
  )
}

export default Button;

