import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { subscribeToUserStatus } from "../../lib/FirebaseHelpers";
import { formatLastSeen } from "../../utils/formatLastSeen";
import ProfileModal from "./ProfileModal";
import UserStatusIndicator from "./UserStatusIndicator";
import { ArrowLeft } from "lucide-react";

const ChatHeader = ({ selectedUser, onBack, isMobile }) => {
    const [showProfile, setShowProfile] = useState(false);
    const [onlineStatus, setOnlineStatus] = useState({
        isOnline: false,
        lastSeen: null,
        state: "offline",
    });

    useEffect(() => {
        if (!selectedUser?.id) return;
        const unsubscribe = subscribeToUserStatus(selectedUser.id, setOnlineStatus);
        return () => unsubscribe();
    }, [selectedUser]);

    const statusText = onlineStatus?.isOnline
        ? "Online"
        : `Last seen ${formatLastSeen(onlineStatus?.lastSeen)}`;

    return (
        <>
            <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white shadow-sm">
                {isMobile && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            onBack();
                        }}
                        className="text-gray-600 hover:text-indigo-600 transition"
                    >
                        <ArrowLeft size={22} />
                    </button>
                )}

                <div
                    onClick={() => setShowProfile(true)}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <img
                        src={selectedUser.photoURL || "/default-avatar.png"}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
                    />
                    <div className="flex flex-col">
                        <p className="font-semibold text-gray-900 leading-tight">
                            {selectedUser.displayName}
                        </p>
                        <span className="flex items-center gap-1 text-sm text-gray-500">{selectedUser.bio}</span>
                        {/* <span className="flex items-center gap-1 text-sm text-gray-500">
                            <UserStatusIndicator 
                                isOnline={onlineStatus?.isOnline} 
                                state={onlineStatus?.state} 
                            />

                            {statusText}
                        </span> */}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showProfile && (
                    <ProfileModal
                        user={selectedUser}
                        onClose={() => setShowProfile(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatHeader;
