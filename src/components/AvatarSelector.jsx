import React from 'react';
import { FaTimes } from 'react-icons/fa';
import {avatarMap} from '../assets/assets' // ✅ import avatars array

const AvatarSelector = ({ onSelect, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-[#1e1e1e] p-6 rounded-lg w-[90%] max-w-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-300 hover:text-white"
                >
                    <FaTimes />
                </button>
                <h2 className="text-white mb-4 text-lg text-center">Choose Your Avatar</h2>
                <div className="grid grid-cols-4 gap-4">
                    {avatars.map((avatar, index) => (
                        <img
                            key={index}
                            src={avatar}
                            alt={`Avatar ${index + 1}`}
                            className="w-20 h-20 rounded-full cursor-pointer border-2 border-transparent hover:border-indigo-500"
                            onClick={() => onSelect(avatar)} // ✅ save actual URL (not "/src/...")
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AvatarSelector;
