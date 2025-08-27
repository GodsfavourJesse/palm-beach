import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
// import { avatarMap } from '../../assets'; // ✅ import avatar map
import {avatarMap} from '../../assets/assets'

const UserList = ({ currentUser, recentChats, onUserSelect }) => {
    const [userProfiles, setUserProfiles] = useState({});

    // Fetch displayName + photoURL for each user
    useEffect(() => {
        const fetchUsers = async () => {
            const newProfiles = {};
            for (let chat of recentChats) {
                const otherUserId =
                    chat.senderId === currentUser.uid ? chat.receiverId : chat.senderId;
                if (!userProfiles[otherUserId]) {
                    const userDoc = await getDoc(doc(db, 'users', otherUserId));
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
        <div>
            {recentChats.map((chat, index) => {
                const otherUserId =
                    chat.senderId === currentUser.uid ? chat.receiverId : chat.senderId;
                const isUnread = chat.receiverId === currentUser.uid && !chat.seen;
                const userData = userProfiles[otherUserId] || {};

                const displayName = userData.displayName || 'Unknown User';
                // ✅ Map avatar path -> actual image if needed
                const photoURL =
                    avatarMap[userData.photoURL] || userData.photoURL || '/default-avatar.png';

                return (
                    <div
                        key={index}
                        onClick={() => onUserSelect({ id: otherUserId, ...userData })}
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800 border-b border-gray-700"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={photoURL}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => (e.target.src = '/default-avatar.png')}
                            />
                            <div>
                                <p className="font-medium text-white text-sm">{displayName}</p>
                                <p className="text-gray-400 text-xs">
                                    {chat.text.length > 25 ? chat.text.slice(0, 25) + '...' : chat.text}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            {chat.timestamp?.toDate ? (
                                <p className="text-xs text-gray-500">
                                    {chat.timestamp.toDate().toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            ) : (
                                <p className="text-xs text-gray-500">...</p>
                            )}
                            {isUnread && <span className="w-3 h-3 bg-red-500 rounded-full mt-1" />}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UserList;
