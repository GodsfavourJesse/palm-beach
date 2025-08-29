import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import Sidebar from './Sidebar';
import ChatPanel from './ChatPanel';
import InfoPanel from './InfoPanel';
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

    // Initial splash delay
    useEffect(() => {
        const timer = setTimeout(() => setInitialLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);   

    // Listen for window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !user && !loggingOut) {
            navigate('/login');
        }
    }, [user, loading, loggingOut, navigate]);

    // Listen to recent chats
    useEffect(() => {
        if (!user) return;
        const unsubscribe = getRecentChats(user, setRecentChats);
        return () => unsubscribe && unsubscribe();
    }, [user]);

    // Fetch messages between selected user and current user
    useEffect(() => {
        if (!selectedUser || !user) return;
        const unsubscribe = getMessagesBetweenUsers(user, selectedUser, setMessages);
        return () => unsubscribe && unsubscribe();
    }, [selectedUser, user]);

    // Mark messages as seen
    useEffect(() => {
        const markSeen = async () => {
            const unseen = messages.filter(
                (msg) => msg.receiverId === user.uid && !msg.seen
            );
            unseen.forEach(async (msg) => {
                const msgRef = doc(db, 'messages', msg.id);
                await updateDoc(msgRef, { seen: true });
            });
        };

        if (selectedUser) {
            markSeen();
        }
    }, [messages, selectedUser, user]);

    // Send a new message
    const handleSendMessage = async (text) => {
        if (!user || !selectedUser) return;
            try {
            await sendMessage(user, selectedUser, text);
        } catch (err) {
            console.error('Failed to send message:', err);
            toast.error('Failed to send message');
        }
    };

    // Logout handler
    const handleLogout = async () => {
        setLoggingOut(true);
        setTimeout(() => {
            signOut(auth);
            toast.success('Logged out successfully!');
            navigate('/login');
        }, 6000);
    };

    if (loading || initialLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
                    <p className="text-xl font-semibold">Logging you in...</p>
                </div>
            </div>
        );
    }

    if (loggingOut) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 border-solid mx-auto mb-4"></div>
                    <p className="text-xl font-semibold">Logging you out...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen text-white overflow-hidden relative">
            {isMobile ? (
                <div className="h-full w-full">
                    {!selectedUser ? (
                        <Sidebar
                            currentUser={user}
                            onUserSelect={setSelectedUser}
                            recentChats={recentChats}
                            isMobile={true}
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
                </div>
            ) : (
                <div className="flex h-full w-full gap-3">
                    <Sidebar
                        currentUser={user}
                        onUserSelect={setSelectedUser}
                        recentChats={recentChats}
                        isMobile={false}
                    />
                    <ChatPanel
                        selectedUser={selectedUser}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isMobile={false}
                    />
                    <InfoPanel />
                </div>
            )}
        </div>
    );
};

export default ChatHome;
