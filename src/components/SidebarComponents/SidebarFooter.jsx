import React, { useRef, useState } from "react";
import { Home, User, MessageSquare, UserPlus, Users } from "lucide-react";
import SearchUsersPage from "../SidebarFooterPages/SearchUserPage";
import InviteFriendsMenu from "../SidebarFooterPages/InviteFriendsMenu";

const SidebarFooter = ({ onOpenInfo, onUserSelect }) => {
    const [showSheet, setShowSheet] = useState(false);
    const [showInvite, setShowInvite] = useState(false);
    const [ showSearch, setShowSearch] = useState(false);

    const [translateY, setTranslateY] = useState(0);
    const startY = useRef(null);

    // start drag
    const handleTouchStart = (e) => {
        startY.current = e.touches[0].clientY;
    };

    // Dragging
    const handleTouchMove = (e) => {
        if (startY.current !== null) {
            const currentY = e.touches[0].clientY;
            const diff = currentY - startY.current;
            if (diff > 0) {
                setTranslateY(diff); //move sheet down
            }
        }
    };

    // End drag
    const handleTouchEnd = () => {
        if (translateY > 120) {
            // swipe down enough -> close sheet
            setShowSheet(false);
        }
        setTranslateY(0) //reset position
        startY.current = null;
    }

    return (
        <>
            {/* Footer */}
            <div className="flex justify-around items-center backdrop-blur-md bg-white/30 border-t border-white/20 p-3 fixed bottom-0 left-0 w-full z-40">
                <button 
                    className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-colors"
                >
                    <Home size={20} />
                    <span className="text-xs">Home</span>
                </button>

                {/* Floating Action Button */}
                <button
                    onClick={() => setShowSheet(true)}
                    className="lex flex-col items-center text-white bg-indigo-700 rounded-full px-6 py-2 shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform"
                >
                    + New Chat
                </button>

                <button
                    onClick={onOpenInfo}
                    className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-colors"
                >
                    <User size={20} />
                    <span className="text-xs">Profile</span>
                </button>
            </div>

            {/* Bottom Sheet Modal */}
            {showSheet && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex  flex-col justify-end items-center pb-10 px-4 z-50"
                    onClick={() => setShowSheet(false)}
                >
                    <div
                        className="bg-white/80 backdrop-blur-xl w-full rounded-3xl p-5 shadow-2xl animate-slide-up border border-white/20"
                        onClick={(e) => e.stopPropagation()} // prevent closing on content click
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{ transform: `translateY(${translateY}px)` }}
                    >
                        {/* Drag handle */}
                        <div className="w-12 h-1.5 bg-gray-400/50 rounded-full mx-auto mb-4"></div>


                        {/* Options */}
                        <div className="space-y-2">
                            <button
                                className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-white/60 transition"
                                onClick={() => {
                                console.log("New Chat");
                                setShowSearch(true);
                                setShowSheet(false);
                                }}
                            >
                                <MessageSquare 
                                    size={22}            className="text-indigo-600" 
                                />
                                <div className="text-left">
                                    <p className="font-medium text-gray-700">New Chat</p>
                                    <p className="text-xs text-gray-600">Search users to chat with</p>
                                </div>
                            </button>

                            <button
                                className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-white/60 transition"
                                onClick={() => {
                                console.log("New Contact");
                                setShowSheet(false);
                                }}
                            >
                                <UserPlus 
                                    size={22} 
                                    className="text-indigo-600" 
                                />
                                <div className="text-left">
                                    <p className="font-medium text-gray-700">New Contact</p>
                                    <p className="text-xs text-gray-600">Add a contact to be able to send messages</p>
                                </div>
                            </button>

                            <button
                                className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-white/60 transition"
                                onClick={() => {
                                console.log("New Community");
                                setShowSheet(false);
                                setShowInvite(true);
                                }}
                            >
                                <Users 
                                    size={22} 
                                    className="text-indigo-600" 
                                />
                                <div className="text-left">
                                    <p className="font-medium text-gray-700">Invite Friends</p>
                                    <p className="text-xs text-gray-600">Share to your friends on other platform</p>
                                </div>
                            </button>
                        </div>

                    </div>
                        {/* Cancel */}
                        <button
                            onClick={() => setShowSheet(false)}
                            className="w-50 mt-4 py-3 bg-white/80 hover:bg-gray-300/80 rounded-full font-medium text-gray-900 backdrop-blur-md transition"
                        >
                            Cancel
                        </button>
                </div>
            )}

            {showInvite && <InviteFriendsMenu onClose={() => setShowInvite(false)} />}

            {showSearch && (
                <SearchUsersPage 
                    onBack={() => setShowSearch(false)} 
                    onUserSelect={(user) => {
                        onUserSelect(user);
                        setShowSearch(false);
                    } }
                />
            )}
        </>
    );
};

export default SidebarFooter;
