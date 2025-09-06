import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import Sidebar from './Sidebar';
import ChatPanel from './ChatPanel';
import InfoPanel from './InfoPanel';
import SearchUsersPage from '../../components/SidebarFooterPages/SearchUserPage';
import { auth, db } from '../../firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import {
    getRecentChats,
    getMessagesBetweenUsers,
    sendMessage,
} from '../../lib/FirebaseHelpers';

const ChatHome = () => {
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    const [loggingOut, setLoggingOut] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [recentChats, setRecentChats] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showInfoPanel, setShowInfoPanel] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const handleOpenInfoPanel = () => setShowInfoPanel(true);
    const handleCloseInfoPanel = () => setShowInfoPanel(false);

    // ✅ Normalize selected user object (always has .uid)
    const handleUserSelect = (u) => {
        if (!u) return;
        const normalized = {
            uid: u.uid || u.id,
            displayName: u.displayName || u.name || u.email || 'Unnamed',
            email: u.email || '',
            photoURL: u.photoURL || u.profilePicture || u.photo || null,
        };
        setSelectedUser(normalized);
        setShowSearch(false);
    };

    // ✅ Splash screen (2s)
    useEffect(() => {
        const timer = setTimeout(() => setInitialLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // ✅ Window resize handler
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ✅ Auth check
    useEffect(() => {
        if (!loading && !user && !loggingOut) navigate('/login');
    }, [user, loading, loggingOut, navigate]);

    // ✅ Recent chats
    useEffect(() => {
        if (!user) return;
        const unsubscribe = getRecentChats(user, setRecentChats);
        return () => unsubscribe && unsubscribe();
    }, [user]);

    // ✅ Messages with selected user
    useEffect(() => {
        if (!selectedUser || !user) return;
        const unsubscribe = getMessagesBetweenUsers(user, selectedUser, setMessages);
        return () => unsubscribe && unsubscribe();
    }, [selectedUser, user]);

    // ✅ Mark as seen
    useEffect(() => {
        const markSeen = async () => {
            const unseen = messages.filter(
                (msg) => msg.receiverId === user?.uid && !(msg.seen ?? false)
            );
            unseen.forEach(async (msg) => {
                try {
                    const msgRef = doc(db, 'messages', msg.id);
                    await updateDoc(msgRef, { seen: true });
                } catch (err) {
                    console.error('Failed to mark as seen:', err);
                }
            });
        };
        if (selectedUser && user) markSeen();
    }, [messages, selectedUser, user]);

    // ✅ Send message
    const handleSendMessage = async (text) => {
        if (!user || !selectedUser) return;
        try {
            await sendMessage(user, selectedUser, text);
        } catch (err) {
            console.error('Failed to send message:', err);
            toast.error('Failed to send message');
        }
    };

    // ✅ Logout (sign out immediately, then show spinner)
    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await signOut(auth);
            toast.success('Logged out successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 2000); // small delay for UX
        } catch (err) {
            console.error('Logout failed:', err);
            toast.error('Logout failed');
            setLoggingOut(false);
        }
    };

    // ✅ Loading states
    if (loading || initialLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-xl font-semibold">Logging you in...</p>
                </div>
            </div>
        );
    }

    if (loggingOut) {
        return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 mx-auto mb-4"></div>
                <p className="text-xl font-semibold">Logging you out...</p>
            </div>
        </div>
        );
    }

    // ✅ Main UI
    return (
        <div className="h-screen w-screen text-white overflow-hidden relative">
            {isMobile ? (
                <div className="h-full w-full">
                    {showSearch ? (
                        <SearchUsersPage
                            onBack={() => setShowSearch(false)}
                            onUserSelect={(user) => {
                                setSelectedUser(user);  // ✅ open DM
                                setShowSearch(false);   // ✅ close search page
                            }}
                        />
                    ) : !selectedUser ? (
                        <Sidebar
                            currentUser={user}
                            onUserSelect={handleUserSelect}
                            recentChats={recentChats}
                            isMobile={true}
                            onOpenInfo={handleOpenInfoPanel}
                            onOpenSearch={() => setShowSearch(true)}
                            onLogout={handleLogout} // ✅ pass logout down if needed
                        />
                    ) : (
                        <ChatPanel
                            selectedUser={selectedUser}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            onBack={() => setSelectedUser(null)}
                            isMobile={true}
                        />
                    )}

                    {showInfoPanel && (
                        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm">
                        <InfoPanel onClose={handleCloseInfoPanel} />
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex h-full w-full gap-3">
                    {showSearch ? (
                        <SearchUsersPage
                            onBack={() => setShowSearch(false)}
                            onUserSelect={(user) => {
                                setSelectedUser(user);  // ✅ open DM
                                setShowSearch(false);   // ✅ close search page
                            }}
                        />
                    ) : (
                        <>
                        <Sidebar
                            currentUser={user}
                            onUserSelect={handleUserSelect}
                            recentChats={recentChats}
                            isMobile={false}
                            onOpenInfo={handleOpenInfoPanel}
                            onOpenSearch={() => setShowSearch(true)}
                            onLogout={handleLogout}
                        />
                        <ChatPanel
                            selectedUser={selectedUser}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isMobile={false}
                        />
                        </>
                    )}
                    {showInfoPanel && <InfoPanel onClose={handleCloseInfoPanel} />}
                </div>
            )}
        </div>
    );
};

export default ChatHome;
