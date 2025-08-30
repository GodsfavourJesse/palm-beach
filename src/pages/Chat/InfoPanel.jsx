import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import {
    FaUserPlus,
    FaEdit,
    FaArrowLeft,
    FaEllipsisV,
    FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EditProfile from "../Profile/EditProfile";
import LogoutModal from "../../components/LogoutModal";
import {
    Lock,
    Bell,
    Moon,
    HelpCircle,
    LogOut,
    Shield,
    Globe,
} from "lucide-react";

const InfoPanel = ({ onClose }) => {
    const [user] = useAuthState(auth);
    const [showEdit, setShowEdit] = useState(false);
    const navigate = useNavigate();
    const [bio, setBio] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        const fetchBio = async () => {
            if (!user) return;
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                setBio(userDoc.data().bio || "");
            }
        };
        fetchBio();
    }, [user]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            window.location.reload();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="w-full md:w-96 bg-white h-screen flex flex-col shadow-lg relative">

            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <FaArrowLeft size={18} />
                    </button>
                )}
                <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
                <div className="flex items-center gap-3">
                    <button
                        className="text-gray-500 hover:text-indigo-600 transition"
                        onClick={() => setShowEdit(true)}
                        title="Edit Profile"
                    >
                        <FaEdit size={18} />
                    </button>

                    {/* Menu */}
                    <div className="relative">
                        <button
                            className="text-gray-500 hover:text-indigo-600 transition"
                            onClick={() => setShowMenu((prev) => !prev)}
                            title="More Options"
                        >
                            <FaEllipsisV size={18} />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-40">
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        setShowLogoutModal(true);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                                >
                                    <FaSignOutAlt /> Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showLogoutModal && (
                <LogoutModal
                    onCancel={() => setShowLogoutModal(false)}
                    onConfirm={() => {
                        setShowLogoutModal(false);
                        handleLogout();
                    }}
                />
            )}

            {/* Content */}
            {!showEdit ? (
                <div className="flex flex-col flex-grow overflow-y-auto">
                    {/* User Info */}
                    <div className="flex flex-col items-center py-8 px-4 border-b border-gray-100">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100 shadow-md">
                                {user?.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-2xl font-bold">
                                        {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="mt-4 text-lg font-semibold text-gray-800">
                        {user?.displayName || "Anonymous User"}
                        </p>
                        {bio && <p className="text-sm text-gray-600 mt-1">{bio}</p>}
                        <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                    </div>

                    {/* About Section */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">About</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {bio ||
                                "No bio added yet. Tell your friends a little about yourself!"
                            }
                        </p>
                    </div>

                    {/* Shared Files */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Shared Files (14)
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-full h-[70px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm cursor-pointer hover:bg-gray-200 transition"
                                >
                                    File
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="px-6 py-6 bg-white rounded-2xl shadow-lg mt-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-600" />
                            Settings
                        </h4>

                        <div className="space-y-6 text-sm text-gray-700">
                            {/* Privacy */}
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-3">
                                    <Lock className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Privacy</span>
                                </span>
                                <button className="text-xs px-4 py-1.5 rounded-lg border border-gray-300 hover:border-indigo-500 hover:text-indigo-600 transition">
                                    Manage
                                </button>
                            </div>

                            {/* Notifications */}
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Notifications</span>
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" defaultChecked 
                                    />
                                    <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition"></div>
                                </label>
                            </div>

                            {/* Dark Mode */}
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-3">
                                    <Moon className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Dark Mode</span>
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                    />
                                    <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition"></div>
                                </label>
                            </div>

                            {/* Language / Region */}
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Language & Region</span>
                                </span>
                                <button className="text-xs px-4 py-1.5 rounded-lg border border-gray-300 hover:border-indigo-500 hover:text-indigo-600 transition">
                                    Change
                                </button>
                            </div>

                            {/* Help & Support */}
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-3">
                                    <HelpCircle className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Help & Support</span>
                                </span>
                                <button className="text-xs px-4 py-1.5 rounded-lg border border-gray-300 hover:border-indigo-500 hover:text-indigo-600 transition">
                                    Open
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Edit Profile Panel
                <div className="absolute inset-0 bg-white animate-slide-in-right z-50">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <button
                            onClick={() => setShowEdit(false)}
                            className="text-gray-500 hover:text-red-500 transition"
                            title="Back"
                        >
                            <FaArrowLeft />
                        </button>
                        <h3 className="text-lg font-semibold text-gray-800">
                            Edit Profile
                        </h3>
                        <span></span>
                    </div>
                    <EditProfile onClose={() => setShowEdit(false)} />
                </div>
            )}

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <button
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-lg font-medium transition"
                    onClick={() => navigate("/invite-friends")}
                >
                    <FaUserPlus /> Invite Friends
                </button>
            </div>
        </div>
    );
};

export default InfoPanel;
