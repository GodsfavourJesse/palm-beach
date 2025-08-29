import React, { useRef, useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";

const MessageInput = ({ onSend, disabled }) => {
    const [text, setText] = useState("");
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text.trim());
        setText("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 p-3 bg-white"
        >
            <textarea
                ref={textareaRef}
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 resize-none px-4 py-2 bg-gray-50 text-gray-800 rounded-2xl outline-none border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition max-h-40 overflow-y-auto"
                disabled={disabled}
            />
            <button
                type="submit"
                disabled={disabled || !text.trim()}
                className="p-3 rounded-full bg-indigo-500 text-white shadow-md hover:bg-indigo-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <FaPaperPlane size={16} />
            </button>
        </form>
    );
};

export default MessageInput;
