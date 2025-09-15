import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Search, X } from "lucide-react";
import UserSearch from "../../components/SidebarComponents/UserSearch";
import UserList from "../../components/SidebarComponents/UserList";
import SidebarFooter from "../../components/SidebarComponents/SidebarFooter";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const Sidebar = ({ currentUser, onUserSelect, recentChats, isMobile, onOpenInfo }) => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [bio, setBio] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const fetchBio = async () => {
            if (!user) return;
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setBio(userDoc.data().bio || "");
                }
            } catch (error) {
                console.error("Error fetching bio:", error);
            }
        };
        fetchBio();
    }, [user]);

    const handleNewChat = () => {
        console.log("Start new chat"); 
        // you can navigate to a new chat page, or open a modal here
        navigate("/new-chat");
    };

    

    return (
        <div
            className={`h-screen ${
                isMobile ? "w-full" : "w-80"
            } flex flex-col bg-white text-gray-900 border-r border-gray-200`}
            >
            {/* Header with Search Icon */}
            <div className="flex items-center justify-between p-4">
                <h1 className="text-xl font-semibold flex items-center gap-2">
                    <MessageSquare size={20} className="text-indigo-600" />
                    Chats
                </h1>

                {/* Toggle Search */}
                <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="text-gray-500 hover:text-indigo-600"
                >
                    {showSearch ? <X size={20} /> : <Search size={20} />}
                </button>
            </div>

            {/* Conditional Search Box */}
            {showSearch && (
                <div className="p-3">
                    <UserSearch onUserSelect={onUserSelect} />
                </div>
            )}

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <UserList
                    currentUser={currentUser}
                    recentChats={recentChats}
                    onUserSelect={onUserSelect}
                />
            </div>

            {/* Footer Menu (Mobile Only) */}
            {isMobile && (
                <SidebarFooter 
                    onNewChat={handleNewChat} 
                    onOpenInfo={onOpenInfo}
                    onUserSelect={onUserSelect} 
                />            
            )}
        </div>
    );
};

export default Sidebar;
