import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { toast, ToastContainer } from "react-toastify";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset link sent to your email!");
        } catch (error) {
            console.error("Reset error:", error);
            toast.error("Failed to send reset link.");
        }
    };

    return (
        <div className="relative w-full h-[100vh] mx-auto p-4 flex flex-col items-center justify-center text-white bg-cover bg-center" style={{backgroundImage: `url(${assets.beach_1})`}}>

            <div className="absolute inset-0 bg-black/70 backdrop-brightness-50"></div> {/* Dark overlay */}

            <div className="max-w-md w-full p-6 rounded-xl shadow-lg z-[10000]">
                <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
                <form onSubmit={handleReset} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 rounded-xl bg-[#121212] border border-gray-600 text-white focus:outline-none focus:border-indigo-600"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition cursor-pointer"
                    >
                        Send Reset Link
                    </button>
                    <p 
                        onClick={() => navigate('/login')}
                        className="text-center cursor-pointer hover:text-indigo-700"
                    >Go back to login</p>
                </form>
                <ToastContainer position="top-center" autoClose={3000} theme="dark" />
            </div>
        </div>
    );
}

export default ResetPassword;
