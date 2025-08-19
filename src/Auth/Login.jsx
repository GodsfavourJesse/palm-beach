import React, { useEffect, useState } from "react";
import { assets, dummyLoginMsg, welcomeSlider } from "../assets/assets";
import Welcome from "./validationComponents/Welcome";

function Login () {
    const [step, setStep] = useState("input");
    const [error, setError] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [charIndex, setCharIndex] = useState(0);

    // Auto-slide logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % welcomeSlider.length);
        }, 4000); // Change every 4 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const currentMessage = dummyLoginMsg[currentMsgIndex];
            
            if (charIndex < currentMessage.length) {
                const timeout = setTimeout(() => {
                    setDisplayText((prev) => prev + currentMessage[charIndex]);
                    setCharIndex((prev) => prev + 1);
                }, 100); // typing speed
    
                return () => clearTimeout(timeout);
            } else {
                // After full message typed, wait 2s then go to next
                const delay = setTimeout(() => {
                    setCharIndex(0);
                    setDisplayText("");
                    setCurrentMsgIndex((prev) => (prev + 1) % dummyLoginMsg.length);
                }, 4000);
    
            return () => clearTimeout(delay);
        }
    }, [charIndex, currentMsgIndex]);
    

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#212121] px-4">

            <div className="absolute inset-0 z-0">
                {welcomeSlider.map((slide, index) => (
                    <img
                        key={index}
                        src={slide.image}
                        alt={`slide-${index}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        index === currentImageIndex ? "opacity-100" : "opacity-0"
                        }`}
                    />
                ))}
                <div className="absolute inset-0 bg-black/70 backdrop-brightness-50"></div> {/* Dark overlay */}
            </div>

            <div className="max-w-md w-full p-6 rounded-xl shadow-lg z-[10000]">
                <div className="flex flex-col items-center justify-center">
                    <img 
                        src={assets.sunset_tour} 
                        alt='logo'
                        className="w-50"
                    />
                    
                    <h3 className="text-gray-200 text-4xl font-bold mb-1">Palm Beach</h3>
                    <p className="text-center text-gray-400 w-[450px] min-w-[20px] h-[24px] min-h-[24px] font-medium">
                        {displayText}
                        <span className="animate-pulse">|</span>
                    </p>



                </div>
                <div className="text-gray-400 mt-4">
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {step === "input" && (
                        <Welcome />
                    )}

                    {/* <div id="recaptcha-container"></div> */}
                </div>
            </div>
        </div>
    );
}

export default Login;
