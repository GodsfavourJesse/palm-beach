// import React, { useRef, useState } from "react";

// function OtpVerification({ phone, onVerify }) {
//     const [otp, setOtp] = useState(new Array(6).fill(""));
//     const inputsRef = useRef([]);

//     const handleChange = (e, index) => {
//         const value = e.target.value.replace(/[^0-9]/g, "");
//         if (!value) return;
//         const newOtp = [...otp];
//         newOtp[index] = value;
//         setOtp(newOtp);
//         if (index < 5 && value) {
//             inputsRef.current[index + 1].focus();
//         }
//     };

//     const handlePaste = (e) => {
//         const paste = e.clipboardData.getData("text").slice(0, 6).split("");
//         const newOtp = [...otp];
//         paste.forEach((char, idx) => {
//             if (idx < 6) newOtp[idx] = char;
//         });
//         setOtp(newOtp);
//         setTimeout(() => {
//             const next = paste.length < 6 ? paste.length : 5;
//             inputsRef.current[next]?.focus();
//         }, 10);
//     };

//     const handleKeyDown = (e, index) => {
//         if (e.key === "Backspace" && !otp[index] && index > 0) {
//             inputsRef.current[index - 1].focus();
//         }
//     };

//     const handleVerify = () => {
//         const enteredOtp = otp.join("");
//         if (enteredOtp.length === 6) {
//             onVerify(enteredOtp);
//         } else {
//             alert("Please enter a valid 6-digit OTP.");
//         }
//     };

//     return (
//         <div className="flex flex-col items-center gap-4 text-white">
//             <h2 className="text-xl font-semibold">Verify Your Number</h2>
//             <p className="text-gray-400">Code sent to: <span className="text-indigo-400">{phone}</span></p>

//             <div className="flex gap-2">
//                 {otp.map((digit, i) => (
//                     <input
//                         key={i}
//                         type="text"
//                         maxLength={1}
//                         className="w-12 h-12 text-center rounded-md bg-[#212121] border border-gray-500 focus:border-indigo-500 outline-none"
//                         value={digit}
//                         onChange={(e) => handleChange(e, i)}
//                         onPaste={handlePaste}
//                         onKeyDown={(e) => handleKeyDown(e, i)}
//                         ref={(el) => (inputsRef.current[i] = el)}
//                     />
//                 ))}
//             </div>

//             <button
//                 onClick={handleVerify}
//                 className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl mt-4"
//             >
//                 Verify
//             </button>
//         </div>
//     );
// }

// export default OtpVerification;



import React, { useState } from "react";

function OtpVerification({ confirmationResult, setStep, setError }) {
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length < 6) {
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }

    try {
      await confirmationResult.confirm(otp);
      setStep("success"); // or wherever next step after verification
    } catch (err) {
      setError("OTP verification failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleVerifyOtp} className="space-y-4">
      <input
        type="text"
        maxLength={6}
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full h-[50px] text-center text-lg border border-gray-500 rounded-xl focus:border-indigo-600 focus:outline-none"
        required
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
      >
        Verify OTP
      </button>
    </form>
  );
}

export default OtpVerification;

