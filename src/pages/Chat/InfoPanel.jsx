import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import { FaUserPlus, FaEdit, FaArrowLeft, FaEllipsisV, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import EditProfile from '../Profile/EditProfile';
import LogoutModal from '../../components/LogoutModal';

const InfoPanel = () => {
    const [user] = useAuthState(auth);
    const [showEdit, setShowEdit] = useState(false);
    const navigate = useNavigate();
    const [bio, setBio] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        const fetchBio = async () => {
            if (!user) return;
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                setBio(userDoc.data().bio || '');
            }
        };
        fetchBio();
    }, [user]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            window.location.reload(); // or navigate to login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };


    return (
        <div className="w-80 relative border-l border-gray-800 h-screen text-white flex flex-col justify-between transition-all duration-300 overflow-hidden">
            {/* Default Profile View */}
            {!showEdit && (
                <div className="flex flex-col h-full justify-between">
                    <div>
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between relative">
                            <h3 className="text-lg font-semibold">Profile</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    className="text-gray-400 hover:text-indigo-400 cursor-pointer"
                                    onClick={() => setShowEdit(true)}
                                    title="Edit Profile"
                                >
                                    <FaEdit size={18} />
                                </button>

                                <div className="relative">
                                    <button
                                        className="text-gray-400 hover:text-indigo-400 cursor-pointer"
                                        onClick={() => setShowMenu(prev => !prev)}
                                        title="More Options"
                                    >
                                        <FaEllipsisV size={18} />
                                    </button>

                                    {showMenu && (
                                        <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 w-32">
                                            <button
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    setShowLogoutModal(true);
                                                }}
                                                className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-red-600 hover:text-white text-sm text-gray-300"
                                            >
                                                <FaSignOutAlt />
                                                Log Out
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



                        {/* User Info */}
                        <div className="flex flex-col items-center py-6 px-4">
                            <div
                                className="w-20 h-20 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center text-xl font-bold uppercase relative group cursor-pointer"
                                title={bio || user?.email}
                            >
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{user?.displayName?.charAt(0) || user?.email?.charAt(0)}</span>
                                )}

                                {/* Hover Tooltip */}
                                <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 text-xs px-3 py-1 bg-gray-800 text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {bio || user?.email}
                                </div>
                            </div>

                            <p className="mt-3 font-semibold text-center">{user?.displayName || 'Anonymous User'}</p>

                            {bio && <p className="text-sm text-gray-400 mt-1">{bio}</p>}
                            <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                        </div>

                        {/* Shared Files */}
                        <div className="px-4 mt-4">
                            <h4 className="text-sm font-semibold mb-2">Shared Files (14)</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-full h-[60px] bg-gray-600 rounded-md flex items-center justify-center"
                                    >
                                        <span className="text-gray-300 text-sm">Img</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Invite Button */}
                    <div className="p-4 border-t border-gray-700">
                        <button
                            className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-indigo-700 w-full py-2 rounded-md transition cursor-pointer"
                            onClick={() => navigate('/invite-friends')}
                        >
                            <FaUserPlus /> Invite Friends
                        </button>
                    </div>
                </div>
            )}

            {/* Slide-in EditProfile Panel */}
            {showEdit && (
                <div className="absolute top-0 left-0 w-full h-full bg-[#1e1e2f] z-50 animate-slide-in-right">
                    <div className="flex items-center justify-between p-4 border-b border-gray-700">
                        <button
                            onClick={() => setShowEdit(false)}
                            className="text-gray-400 hover:text-red-400"
                            title="Back"
                        >
                            <FaArrowLeft />
                        </button>
                        <h3 className="text-lg font-semibold">Edit Profile</h3>
                        <span></span>
                    </div>
                    <EditProfile onClose={() => setShowEdit(false)} />
                </div>
            )}
        </div>
    );
};

export default InfoPanel;
