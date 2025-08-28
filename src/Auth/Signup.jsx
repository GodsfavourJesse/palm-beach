import { useEffect, useState } from "react";
import { assets, dummySignupMsg } from "../assets/assets";
import Newbie from "./validationComponents/Newbie";

function Signup() {
    const [step, setStep] = useState("input");
    const [error, setError] = useState("");
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [charIndex, setCharIndex] = useState(0);

    // Typing animation
    useEffect(() => {
        const currentMessage = dummySignupMsg[currentMsgIndex];

        if (charIndex < currentMessage.length) {
            const timeout = setTimeout(() => {
                setDisplayText((prev) => prev + currentMessage[charIndex]);
                setCharIndex((prev) => prev + 1);
            }, 60);

            return () => clearTimeout(timeout);
        } else {
            const delay = setTimeout(() => {
                setCharIndex(0);
                setDisplayText("");
                setCurrentMsgIndex((prev) => (prev + 1) % dummySignupMsg.length);
            }, 3000);

            return () => clearTimeout(delay);
        }
    }, [charIndex, currentMsgIndex]);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1c1c1c] via-[#121212] to-[#0a0a0a] px-4">
        
            {/* Branding */}
            <div className="flex flex-col items-center">
                <img 
                    src={assets.sunset_tour} 
                    alt="Palm Beach Logo" 
                    className="w-20 h-20 object-contain mb-3 drop-shadow-xl"
                />
                <h1 className="text-4xl font-extrabold text-white tracking-wide">
                    Palm Beach
                </h1>
                {/* <p className="text-center text-gray-400 w-[90%] md:w-[450px] h-[28px] mt-2 font-medium transition-all">
                {displayText}
                <span className="animate-pulse text-blue-400">|</span>
                </p> */}
            </div>

            {/* Form container */}
            <div className="max-w-md w-full mt-6 p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/10">
                {error && (
                    <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>
                )}

                {step === "input" && (
                    <Newbie setError={setError} />
                )}

                {/* Future steps can go here */}
                {/* {step === "otp" && <OtpVerification />} */}
            </div>

            {/* Footer */}
            <p className="text-gray-500 text-xs mt-6">
                © {new Date().getFullYear()} Palm Beach. All rights reserved.
            </p>
        </div>
    );
}

export default Signup;
