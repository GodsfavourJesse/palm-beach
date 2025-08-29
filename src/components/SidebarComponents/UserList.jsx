import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { avatarMap } from "../../assets/assets";

const UserList = ({ currentUser, recentChats, onUserSelect }) => {
    const [userProfiles, setUserProfiles] = useState({});

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
                const unreadCount = chat.unreadCount || (isUnread ? 1 : 0); // fallback

                const userData = userProfiles[otherUserId] || {};
                const displayName = userData.displayName || "Unknown User";
                const photoURL =
                avatarMap[userData.photoURL] ||
                userData.photoURL ||
                "/default-avatar.png";

                return (
                    <button
                        key={index}
                        onClick={() => onUserSelect({ id: otherUserId, ...userData })}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition 
                        ${unreadCount > 0 }`}
                    >
                        {/* Avatar */}
                        <img
                            src={photoURL}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200"
                            onError={(e) => (e.target.src = "/default-avatar.png")}
                        />

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
