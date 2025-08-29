import React, { useRef, useState } from 'react';
import MessageBubble from '../../components/ChatPanelComponents/MessageBubble';
import MessageInput from '../../components/ChatPanelComponents/MessageInput';
import ChatHeader from '../../components/ChatPanelComponents/ChatHeader';
import TypingIndicator from '../../components/ChatPanelComponents/TypingIndicator';
import ProfileModal from '../../components/ChatPanelComponents/ProfileModal';
import { groupMessagesByDate } from '../../utils/groupMessagesByDate';
import { auth } from '../../firebase/firebase';
import { useChatEffects } from '../../hooks/useChatEffects';

const ChatPanel = ({ selectedUser, messages, onSendMessage, isTyping, onBack, isMobile }) => {
    const scrollRef = useRef(null);
    const lastMessageRef = useRef(null);

    const [isAtBottom, setIsAtBottom] = useState(true);
    const [showNewMsgBadge, setShowNewMsgBadge] = useState(false);
    const [lastMsgCount, setLastMsgCount] = useState(0);
    const [showProfile, setShowProfile] = useState(false);

    const currentUser = auth.currentUser;

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
        setShowNewMsgBadge(false);
    };

    useChatEffects({
        scrollRef,
        messages,
        selectedUser,
        currentUser,
        lastMsgCount,
        setLastMsgCount,
        setIsAtBottom,
        setShowNewMsgBadge,
        isAtBottom,
        scrollToBottom,
    });

    const groupedMessages = groupMessagesByDate(messages || []);

    if (!selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-400">
                <p>Select a user to start chatting.</p>
            </div>
        );
    }

    let unreadDividerShown = false;

    return (
        <div className="flex-1 flex flex-col h-full relative">

            {/* Fixed Header */}
            <div className="sticky top-0 z-20 bg-white shadow-sm">
                <ChatHeader
                    selectedUser={selectedUser}
                    onClick={() => setShowProfile(true)}
                    onBack={onBack}
                    isMobile={isMobile}
                />
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar"
            >
                {groupedMessages.map((group, index) => (
                    <div key={index}>
                        <div className="text-center text-xs text-gray-400 py-1">
                            {group.label}
                        </div>
                        <div className="space-y-2 mt-2">
                            {group.messages.map((msg, msgIndex) => {
                                const isUnread =
                                !unreadDividerShown &&
                                msg.receiverId === currentUser?.uid &&
                                !msg.seen;
                                if (isUnread) unreadDividerShown = true;
                                return (
                                <React.Fragment key={msgIndex}>
                                    {isUnread && (
                                    <div className="text-center text-[11px] text-yellow-400 font-semibold py-1">
                                        — Unread Messages —
                                    </div>
                                    )}
                                    <MessageBubble message={msg} />
                                </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                ))}
                {isTyping && <TypingIndicator user={selectedUser} />}
                <div ref={lastMessageRef} />
            </div>

            {/* New Message Badge */}
            {showNewMsgBadge && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
                    <button
                        onClick={scrollToBottom}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded-full shadow-md"
                    >
                        New message ↓
                    </button>
                </div>
            )}

            {/* Fixed Input */}
            <div className="sticky bottom-0 z-20 bg-white border-t">
                <MessageInput onSend={onSendMessage} disabled={!selectedUser} />
            </div>

            {/* Profile Modal */}
            {showProfile && (
                <ProfileModal user={selectedUser} onClose={() => setShowProfile(false)} />
            )}
        </div>
    );
};

export default ChatPanel;
