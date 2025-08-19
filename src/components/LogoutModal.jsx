import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { assets } from '../assets/assets';

const LogoutModal = ({ onCancel, onConfirm }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-gradient-to-b from-[#1e1e2f] to-[#141421] text-white p-6 rounded-2xl shadow-2xl w-96 space-y-4 border border-gray-700 relative">
                {/* Beach Illustration */}
                <div className="flex justify-center -mt-16">
                    <img
                        src={assets.beach}
                        alt="Leaving the beach"
                        className="w-32 h-32 object-contain drop-shadow-md"
                    />
                </div>

                {/* Title and Message */}
                <h3 className="text-center text-xl font-semibold text-red-400 flex items-center justify-center gap-2 mt-2">
                    <FaSignOutAlt /> Leaving the Beach?
                </h3>

                <p className="text-center text-sm text-gray-300">
                    You're leaving the beach... but your conversations are safely saved in the sand.
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition text-sm"
                    >
                        Stay
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 bg-red-600 rounded-md hover:bg-red-700 transition text-sm"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
