import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    browserLocalPersistence,
    browserSessionPersistence,
    setPersistence,
    sendEmailVerification,
    updateProfile,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import KeepLoggedIn from "./KeepLoggedIn";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Newbie() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSendLink = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await setPersistence(
                auth,
                keepLoggedIn ? browserLocalPersistence : browserSessionPersistence
            );

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            await updateProfile(user, {
                displayName,
                photoURL: "",
            });

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                emailLower: user.email.toLowerCase(),
                createdAt: new Date(),
                displayName: displayName,
                displayNameLower: displayName.toLowerCase(),
                bio: "",
                photoURL: "",
            });

            await sendEmailVerification(user);
            toast.info("Verification email sent! Check your inbox");

            if (keepLoggedIn) {
                localStorage.setItem("lastLogin", Date.now());
            }

            toast.success("Signup successful!");
            navigate("/home");
        } catch (error) {
            console.error("Signup error:", error);
            if (error.code === "auth/email-already-in-use") {
                toast.error("This email is already in use.");
            } else if (error.code === "auth/invalid-email") {
                toast.error("Invalid email format.");
            } else if (error.code === "auth/weak-password") {
                toast.error("Password should be at least 6 characters.");
            } else {
                toast.error("Signup failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSendLink}
            className={`space-y-5 transition-all duration-300 ${
                loading ? "opacity-60 pointer-events-none" : ""
            }`}
        >
            {/* Display Name */}
            <div>
                <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                />
            </div>

            {/* Email */}
            <div>
                <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            {/* Password */}
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3 text-gray-400 hover:text-gray-200 transition"
                >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
            </div>

            {/* Keep Logged In */}
            <KeepLoggedIn
                keepLoggedIn={keepLoggedIn}
                setKeepLoggedIn={setKeepLoggedIn}
            />

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center transition transform hover:scale-[1.01] shadow-md"
            >
                {loading ? (
                <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 010 16v4l3.5-3.5L12 20v-4a8 8 0 01-8-8z"
                    ></path>
                </svg>
                ) : (
                    "Create Account"
                )}
            </button>

            {/* Login Redirect */}
            <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-indigo-400 font-medium hover:underline"
                >
                Login
                </Link>
            </p>

            {/* Toast notifications */}
            <ToastContainer position="top-center" autoClose={3000} theme="dark" />
        </form>
    );
}

export default Newbie;
