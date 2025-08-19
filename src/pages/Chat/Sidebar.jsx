import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, MessageSquare } from 'lucide-react';
import UserSearch from '../../components/UserSearch';
import UserList from '../../components/SidebarComponents/UserList';
import { FaEllipsisV, FaSignOutAlt } from 'react-icons/fa';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';
import LogoutModal from '../../components/LogoutModal';

const Sidebar = ({ currentUser, onUserSelect, recentChats, isMobile }) => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
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

    const handleUserSelect = (user) => {
        onUserSelect(user);
        console.log('User selected:', user);
    };


    const handleLogout = async () => {
        try {
            await auth.signOut();
            window.location.reload(); // or navigate to login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div
            className={`h-screen ${
                isMobile ? 'w-full' : 'w-80'
            } text-white flex flex-col px-4 py-5 border-r border-white/20 shadow-md`}
        >
            {/* Mobile Header */}
            {isMobile && (
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <MessageSquare size={20} />
                        Palm Beach
                    </h2>
                    <div className='relative'>
                        <button
                            className='text-gray-400 hover:text-indigo-400 cursor-pointer'
                            onClick={() => setShowMenu(prev => !prev)}
                            title='More Options'
                        >
                            <FaEllipsisV size={18} />
                        </button>
                        {showMenu && (
                            <div className='absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 w-30'>
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        setShowLogoutModal(true);
                                    }}
                                    className='w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-red hover:text:-white text-sm text-gray-300'
                                >
                                    <FaSignOutAlt />
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* App Title */}
            {!isMobile && (
                <h1 className="text-2xl font-bold mb-6 text-white tracking-wide flex items-center gap-2">
                    <MessageSquare size={22} />
                    Palm Beach
                </h1>
            )}

            {/* Search */}
            <div className="mb-4">
                <UserSearch onUserSelect={handleUserSelect} />
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                <h3 className="text-sm font-semibold text-white/70 uppercase mb-1">Recent Chats</h3>
                <div className="space-y-1">
                <UserList
                    currentUser={currentUser}
                    recentChats={recentChats}
                    onUserSelect={onUserSelect}
                />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
