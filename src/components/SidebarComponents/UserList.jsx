import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { avatarMap } from "../../assets/assets";

// Tailwind gradient backgrounds for initials
const gradients = [
    "bg-gradient-to-r from-indigo-500 to-purple-500",
    "bg-gradient-to-r from-pink-500 to-rose-500",
    "bg-gradient-to-r from-green-500 to-emerald-500",
    "bg-gradient-to-r from-yellow-500 to-orange-500",
    "bg-gradient-to-r from-red-500 to-pink-500",
    "bg-gradient-to-r from-blue-500 to-cyan-500",
    "bg-gradient-to-r from-purple-500 to-pink-500",
    "bg-gradient-to-r from-teal-500 to-green-500",
];

// Consistent gradient per user
const getGradientForUser = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
};

const UserList = ({ currentUser, recentChats, onUserSelect }) => {
    const [userProfiles, setUserProfiles] = useState({});
    const [imageErrors, setImageErrors] = useState({}); // track failed images

    useEffect(() => {
        const fetchUsers = async () => {
            const newProfiles = {};
            for (let chat of recentChats) {
                const otherUserId =
                chat.senderId === currentUser.uid ? chat.receiverId : chat.senderId;

                if (!userProfiles[otherUserId]) {
                    const userDoc = await getDoc(doc(db, "users", otherUserId));
                    if (userDoc.exists()) {
                        newProfiles[otherUserId] = userDoc.data();
                    }
                }
            }
            setUserProfiles((prev) => ({ ...prev, ...newProfiles }));
        };

        if (recentChats.length > 0) {
        fetchUsers();
        }
    }, [recentChats]);

    return (
        <div className="space-y-1">
            {recentChats.map((chat, index) => {
                const otherUserId =
                chat.senderId === currentUser.uid ? chat.receiverId : chat.senderId;

                const isUnread = chat.receiverId === currentUser.uid && !chat.seen;
                const unreadCount = chat.unreadCount || (isUnread ? 1 : 0);

                const userData = userProfiles[otherUserId] || {};
                const displayName = userData.displayName || "Unknown User";

                // ✅ Resolve photo correctly
                let resolvedPhoto = null;
                if (userData.photoURL) {
                    if (userData.photoURL.startsWith("http")) {
                        // Firebase Storage or any external image
                        resolvedPhoto = userData.photoURL;
                    } else if (userData.photoURL.startsWith("/src/assets/avatars/")) {
                        // One of your predefined avatars
                        resolvedPhoto = avatarMap[userData.photoURL] || "/default-avatar.png";
                    }
                }

                return (
                    <button
                        key={index}
                        onClick={() => onUserSelect({ id: otherUserId, ...userData })}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition"
                    >
                        {/* Avatar / Initial */}
                        {resolvedPhoto && !imageErrors[otherUserId] ? (
                            <img
                                src={resolvedPhoto}
                                alt="Avatar"
                                className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200"
                                onError={() =>
                                setImageErrors((prev) => ({ ...prev, [otherUserId]: true }))
                                }
                            />
                        ) : (
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white ring-1 ring-gray-200 ${getGradientForUser(
                                otherUserId
                                )}`}
                            >
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{displayName}</p>
                            <p
                                className={`text-sm truncate ${
                                unreadCount > 0
                                    ? "font-semibold text-gray-600"
                                    : "text-gray-500"
                                }`}
                            >
                                {chat.text.length > 30
                                ? chat.text.slice(0, 30) + "..."
                                : chat.text}
                            </p>
                        </div>

                        {/* Timestamp + Unread Badge */}
                        <div className="flex flex-col items-end">
                            {chat.timestamp?.toDate ? (
                                <p
                                className={`text-xs ${
                                    unreadCount > 0
                                    ? "text-indigo-500 font-medium"
                                    : "text-gray-400"
                                }`}
                                >
                                {chat.timestamp.toDate().toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                                </p>
                            ) : (
                                <p className="text-xs text-gray-400">--:--</p>
                            )}

                            {unreadCount > 0 && (
                                <span className="mt-1 bg-indigo-600 text-[11px] min-w-[20px] h-5 px-2 flex items-center justify-center rounded-full text-white font-medium shadow-sm">
                                {unreadCount}
                                </span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default UserList;
