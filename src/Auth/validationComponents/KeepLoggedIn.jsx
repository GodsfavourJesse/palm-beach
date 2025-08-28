import React from "react";
import { motion } from "framer-motion";

const KeepLoggedIn = ({ keepLoggedIn, setKeepLoggedIn }) => {
  const handleToggle = () => {
    const newValue = !keepLoggedIn;
    setKeepLoggedIn(newValue);
    localStorage.setItem("keepLoggedIn", newValue);
  };

  return (
    <div className="flex flex-col gap-1 mt-2">
      {/* Label + Toggle */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="keepLoggedIn"
          className="text-sm font-medium text-gray-300 select-none"
        >
          Keep me logged in
        </label>

        {/* Toggle Switch */}
        <motion.button
          type="button"
          onClick={handleToggle}
          id="keepLoggedIn"
          initial={false}
          animate={{
            backgroundColor: keepLoggedIn
              ? "rgb(79,70,229)" // indigo-600
              : "rgb(75,85,99)", // gray-600
          }}
          transition={{ duration: 0.25 }}
          className="relative w-12 h-6 rounded-full flex items-center px-1"
        >
          <motion.span
            layout
            animate={{
              x: keepLoggedIn ? 24 : 0, // slide right when active
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="w-4 h-4 rounded-full bg-white shadow-md"
          />
        </motion.button>
      </div>

      {/* Description */}
      <motion.p
        key={keepLoggedIn ? "on" : "off"}
        initial={{ opacity: 0, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xs text-gray-500 ml-[2px]"
      >
        Recommended for personal devices only.
      </motion.p>
    </div>
  );
};

export default KeepLoggedIn;
