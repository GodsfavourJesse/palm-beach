import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { subscribeToUserStatus } from '../../lib/FirebaseHelpers';
import { formatLastSeen } from '../../utils/formatLastSeen';
import ProfileModal from './ProfileModal';
import UserStatusIndicator from './UserStatusIndicator';
import { ArrowLeft } from 'lucide-react';

const ChatHeader = ({ selectedUser, onClick, onBack, isMobile }) => {
    const [showProfile, setShowProfile] = useState(false);
    const [onlineStatus, setOnlineStatus] = useState({ isOnline: false, lastSeen: null, state: 'offline' });

    useEffect(() => {
        if (!selectedUser?.id) return;

        const unsubscribe = subscribeToUserStatus(selectedUser.id, (status) => {
        setOnlineStatus(status);
        });

        return () => unsubscribe();
    }, [selectedUser]);

    const statusText = onlineStatus?.isOnline
        ? 'Online'
        : `Last seen: ${formatLastSeen(onlineStatus?.lastSeen)}`;

    return (
        <>
            <div
                className="flex items-center gap-4 p-4 border-b border-gray-700"
            >
                {isMobile && (
                <button onClick={onBack} className="text-white hover:text-gray-400">
                    <ArrowLeft size={20} />
                </button>
                )}
                <div onClick={() => setShowProfile(true)} className="flex items-center gap-3 cursor-pointer">
                    <img
                        src={selectedUser.photoURL || '/default-avatar.png'}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold">{selectedUser.displayName}</p>
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
