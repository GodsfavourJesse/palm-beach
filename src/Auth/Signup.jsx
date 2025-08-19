import { useEffect, useState } from "react";
import { assets, dummySignupMsg } from "../assets/assets";
import Newbie from "./validationComponents/Newbie";

function Signup() {
    const [step, setStep] = useState("input");
    // const [country, setCountry] = useState(countries[0]);
    // const [phone, setPhone] = useState("");
    // const [otp, setOtp] = useState("");
    // const [confirmationResult, setConfirmationResult] = useState(null);
    const [error, setError] = useState("");
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        const currentMessage = dummySignupMsg[currentMsgIndex];
        
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
            setCurrentMsgIndex((prev) => (prev + 1) % dummySignupMsg.length);
            }, 4000);

            return () => clearTimeout(delay);
        }
    }, [charIndex, currentMsgIndex]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#212121] px-4">
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
            <div className="max-w-md w-full p-6 rounded-xl shadow-lg text-gray-400 mt-4">
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {step === "input" && (
                    <Newbie
                        setError={setError}
                    />
                )}

                {/* <div id="recaptcha-container"></div> */}
            </div>
        </div>
    );
}

export default Signup;
