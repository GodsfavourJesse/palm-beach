import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail,  setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import KeepLoggedIn from "./KeepLoggedIn";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



function Welcome () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
        await setPersistence(
            auth,
            keepLoggedIn ? browserLocalPersistence : browserSessionPersistence
        );

        await signInWithEmailAndPassword(auth, email, password);

        // Save login timestamp if needed
        if (keepLoggedIn) {
            localStorage.setItem("lastLogin", Date.now());
        }

        await new Promise((resolve) => setTimeout(resolve, 4500));

        toast.success('login succesful!');
        navigate("/home"); // redirect to homepage
        } catch (err) {
            console.error('Firebase login error:', err.code, err.message);
            toast.error("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleLogin} className={`space-y-5 max-w-md mx-auto p-4 transition-opacity duration-500 ${loading ? "opacity-60 pointer-events-none" : ""}`}>
            {/* <h2 className="text-2xl font-semibold text-white mb-4 text-center">Login</h2> */}

            <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-xl bg-[#121212] border border-gray-600 text-white focus:outline-none focus:border-indigo-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-2 rounded-xl bg-[#121212] border border-gray-600 text-white focus:outline-none focus:border-indigo-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                >
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </div>
            </div>

            <KeepLoggedIn
                keepLoggedIn={keepLoggedIn}
                setKeepLoggedIn={setKeepLoggedIn}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <button
                type="submit"
                className=" flex items-center justify-center w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition cursor-pointer"
                disabled={loading}
            >
                {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 010 16v4l3.5-3.5L12 20v-4a8 8 0 01-8-8z"></path>
                    </svg>
                ) : (
                    "Log In"
                )}
            </button>

            <Link to="/reset-password" className="text-sm text-indigo-400 hover:underline text-center block mt-2">
                Forgot password?
            </Link>
            <Link to="/signup" className="text-sm text-indigo-400 hover:underline text-center block mt-2">
            Sign up
            </Link>


            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

        </form>
    );
}

export default Welcome;
