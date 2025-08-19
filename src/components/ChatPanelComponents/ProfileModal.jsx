import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../../firebase/firebase';
import { subscribeToUserStatus, updateUserStatusState } from '../../lib/FirebaseHelpers';
import UserStatusIndicator from './UserStatusIndicator';

const ProfileModal = ({ user, onClose }) => {
  const currentUser = auth.currentUser;
  const isCurrentUser = currentUser?.uid === user?.id;

  const [status, setStatus] = useState({ isOnline: null, state: 'offline' });

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = subscribeToUserStatus(user.id, (statusData) => {
      setStatus({
        isOnline: statusData?.isOnline ?? false,
        state: statusData?.state || 'offline',
      });
    });

    return () => unsubscribe();
  }, [user]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    await updateUserStatusState(currentUser.uid, newStatus);
  };

  const renderStatus = () => {
    const statusMap = {
      online: '🟢 Online',
      away: '🕒 Away',
      busy: '🔴 Busy',
      offline: '⚫ Offline',
    };

    if (status.isOnline === null) return 'Loading...';
    return status.isOnline ? statusMap[status.state || 'online'] : statusMap['offline'];
  };

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-[#1e1e2f] text-white overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
            <div className="p-6 flex flex-col items-center min-h-screen">
                <img
                    src={user.photoURL || '/default-avatar.png'}
                    alt="avatar"
                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-gray-600"
                />
                    <h2 className="text-2xl font-bold">{user.displayName}</h2>
                    <p className="text-sm text-gray-400 mb-1">{user.email}</p>
                    <UserStatusIndicator
                        isOnline={status.isOnline}
                        state={status.state}
                    />

                {/* Bio */}
                <div className="mt-6 w-full max-w-md space-y-3 text-sm">
                <div className="bg-[#2b2c3f] p-4 rounded-md">
                    <p className="text-gray-400 mb-1">About</p>
                    <p>{user.bio || 'No bio available'}</p>
                </div>
                </div>

                {/* Status selector for current user only */}
                {isCurrentUser && (
                <div className="mt-6 w-full max-w-md">
                    <label className="block text-sm mb-1">Set Your Status:</label>
                    <select
                    value={status.state}
                    onChange={handleStatusChange}
                    className="w-full px-3 py-2 text-sm rounded bg-gray-800 text-white border border-gray-600"
                    >
                    <option value="online">🟢 Online</option>
                    <option value="away">🕒 Away</option>
                    <option value="busy">🔴 Busy</option>
                    <option value="offline">⚫ Offline</option>
                    </select>
                </div>
                )}

                <button
                className="mt-10 px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                onClick={onClose}
                >
                Close
                </button>
            </div>
        </motion.div>
    );
};

export default ProfileModal;
