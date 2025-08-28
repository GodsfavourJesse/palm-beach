import React from "react";
import { assets } from "../assets/assets";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        
            {/* Background circles for modern feel */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"></div>

            {/* Logo / Image */}
            <motion.img
                src={assets.welcomeImg}
                alt="Welcome Illustration"
                className="w-56 h-56 md:w-64 md:h-64 object-contain drop-shadow-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Title + Subtitle */}
            <motion.div
                className="text-center mt-6 px-4"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            >
                <h1 className="text-3xl md:text-5xl font-bold tracking-wide">
                    Welcome to <span className="text-yellow-400">BeachLife</span>
                </h1>
                <p className="mt-3 text-sm md:text-lg text-gray-200 max-w-md mx-auto leading-relaxed">
                    Relax, explore, and connect with the best beach experiences — all in one place.
                </p>
            </motion.div>

            {/* Call to action */}
            <motion.button
                onClick={() => navigate("/signup")}
                className="mt-8 flex items-center gap-2 bg-yellow-400 text-indigo-900 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-300 transition-all cursor-pointer"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
            >
                Get Started
                <FaArrowRight />
            </motion.button>
        </div>
    );
};

export default WelcomePage;
