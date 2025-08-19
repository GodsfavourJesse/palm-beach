import React from 'react';

const NewMessageBadge = ({ onClick }) => {
    return (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
            <button
                onClick={onClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded-full shadow-md transition-all"
            >
                New message ↓
            </button>
        </div>
    );
};

export default NewMessageBadge;