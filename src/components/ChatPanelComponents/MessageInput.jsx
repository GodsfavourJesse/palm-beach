import React, { useRef, useState, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const MessageInput = ({ onSend, disabled }) => {
    const [text, setText] = useState('');
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text.trim());
        setText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center p-3 border-t border-gray-700"
        >
            <textarea
                ref={textareaRef}
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 resize-none px-4 py-2 bg-[#2b2c3f] text-white rounded-xl outline-none max-h-40 overflow-y-auto"
                disabled={disabled}
            />
            <button
                type="submit"
                className="ml-3 text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                disabled={disabled}
            >
                <FaPaperPlane size={18} />
            </button>
        </form>
    );
};

export default MessageInput;
