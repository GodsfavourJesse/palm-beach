import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Info, User as UserIcon, Calendar } from "lucide-react";
import { auth } from "../../firebase/firebase";
import { subscribeToUserStatus, updateUserStatusState } from "../../lib/FirebaseHelpers";
import UserStatusIndicator from "./UserStatusIndicator";

const ProfileModal = ({ user, onClose }) => {
    const currentUser = auth.currentUser;
    const isCurrentUser = currentUser?.uid === user?.id;

    const [status, setStatus] = useState({ isOnline: null, state: "offline" });
    const [createdAt, setCreatedAt] = useState(null);

    useEffect(() => {
        if (!user?.id) return;

        // Subscribe to status changes
        const unsubscribe = subscribeToUserStatus(user.id, (statusData) => {
            setStatus({
                isOnline: statusData?.isOnline ?? false,
                state: statusData?.state || "offline",
            });
        });

        // Get account creation date from Firebase Auth
        if (user?.id) {
            auth.getUser
            if (user.metadata?.creationTime) {
                setCreatedAt(new Date(user.metadata.creationTime));
            }
        }

        return () => unsubscribe();
    }, [user]);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        await updateUserStatusState(currentUser.uid, newStatus);
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-white flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 text-gray-900 bg-gray-50 shadow-md">
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Avatar & Basic Info */}
                <div className="flex flex-col items-center text-center">
                    <img
                        src={user.photoURL || "/default-avatar.png"}
                        alt="avatar"
                        className="w-28 h-28 rounded-full object-cover shadow-md border-2 border-indigo-200"
                    />
                    <h3 className="mt-3 text-xl font-bold text-gray-900">
                        {user.displayName || "Unnamed User"}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                {/* About */}
                <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Info size={16} /> About
                    </h4>
                    <div className="p-3 rounded-xl bg-gray-50 text-sm text-gray-700">
                        {user.bio || "This user hasn’t written a bio yet."}
                    </div>
                </div>

                {/* Extra Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                            <UserIcon size={14} /> Username
                        </p>
                        <p className="text-gray-800 font-medium">
                            @{user.displayName?.toLowerCase().replace(/\s+/g, "_") || "user"}
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                            <Calendar size={14} /> Joined
                        </p>
                        <p className="text-gray-800 font-medium">
                            {createdAt
                                ? createdAt.toLocaleDateString()
                                : "Unknown"}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileModal;
