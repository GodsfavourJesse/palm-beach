import React from 'react';
import { auth } from '../../firebase/firebase';
import TimeDisplay from './TimeDisplay';
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from 'react-icons/io5';

const MessageBubble = ({ message }) => {
    const isSentByCurrentUser = message.senderId === auth.currentUser?.uid;

    const SeenStatus = () => {
        if (!isSentByCurrentUser) return null;

        return (
            <span className="inline-flex items-center ml-1">
                {message.seen ? (
                <IoCheckmarkDoneSharp className="text-blue-500 text-xs" />
                ) : (
                <IoCheckmarkSharp className="text-white/70 text-xs" />
                )}
            </span>
        );
    };

    return (
        <div
            className={`flex px-4 my-2 ${
            isSentByCurrentUser ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`max-w-[80%] p-3 rounded-2xl relative transition-all duration-300
                    shadow-md break-words
                    ${
                        isSentByCurrentUser
                            ? "bg-indigo-700 text-white rounded"
                            : "bg-gray-200 text-gray-900 rounded"
                    }`
                }
            >
            {/* Message text */}
                <p className="text-sm leading-snug">{message.text}</p>

                {/* Time + Seen */}
                <div
                    className={`text-[11px] mt-2 flex justify-end items-center gap-1 
                    ${isSentByCurrentUser ? "text-white/70" : "text-gray-600"}`}
                >
                    <TimeDisplay timestamp={message.timestamp} />
                    <SeenStatus />
                </div>
            </div>
        </div>
    );

};

export default MessageBubble;
