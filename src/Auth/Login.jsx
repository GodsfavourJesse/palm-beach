import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets, dummyLoginMsg, welcomeSlider } from "../assets/assets";
import Welcome from "./validationComponents/Welcome";

function Login() {
  const [step, setStep] = useState("input");
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  // Background auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % welcomeSlider.length);
    }, 6000); // every 6s for smoother experience
    return () => clearInterval(interval);
  }, []);

  // Typing effect
  useEffect(() => {
    const currentMessage = dummyLoginMsg[currentMsgIndex];

    if (charIndex < currentMessage.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + currentMessage[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 80); // typing speed
      return () => clearTimeout(timeout);
    } else {
      const delay = setTimeout(() => {
        setCharIndex(0);
        setDisplayText("");
        setCurrentMsgIndex((prev) => (prev + 1) % dummyLoginMsg.length);
      }, 3500);
      return () => clearTimeout(delay);
    }
  }, [charIndex, currentMsgIndex]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] relative overflow-hidden">

      {/* Background slider */}
      <div className="absolute inset-0 z-0">
        {welcomeSlider.map((slide, index) => (
          <AnimatePresence key={index}>
            {index === currentImageIndex && (
              <motion.img
                key={slide.image}
                src={slide.image}
                alt={`slide-${index}`}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              />
            )}
          </AnimatePresence>
        ))}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-md w-full p-8 rounded-2xl shadow-2xl bg-white/10 border border-white/20 backdrop-blur-lg z-10"
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <motion.img
            src={assets.sunset_tour}
            alt="logo"
            className="w-24"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />
          <h3 className="text-gray-100 text-3xl font-bold tracking-wide">Login</h3>
          <p className="text-center text-gray-300 text-sm min-h-[24px]">
            {displayText}
            <span className="animate-pulse text-indigo-400">|</span>
          </p>
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm mt-3 text-center"
          >
            {error}
          </motion.p>
        )}

        {/* Login Form */}
        <div className="mt-6 text-gray-300">
          {step === "input" && <Welcome />}
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
