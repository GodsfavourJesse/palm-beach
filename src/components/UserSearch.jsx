import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { FaSearch } from 'react-icons/fa';
import { avatarMap } from '../assets/assets';


const UserSearch = ({ onUserSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const currentUser = auth.currentUser;

    const handleSearch = async (term) => {
        const lowerTerm = term.trim().toLowerCase();
        if (!lowerTerm) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const usersRef = collection(db, 'users');
            const snapshot = await getDocs(usersRef);

            const filtered = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(user =>
                    user.displayNameLower?.includes(lowerTerm) ||
                    user.emailLower?.includes(lowerTerm)
                );

            setResults(filtered);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            handleSearch(searchTerm);
        }, 400);
        return () => clearTimeout(delay);
    }, [searchTerm]);

    const getAvatarSrc = (user) => {
        const { photoURL, displayName, email } = user;

        // If it's a known avatar path
        if (photoURL && photoURL.startsWith('/src/assets/avatars/')) {
            return avatarMap[photoURL] || '/default-avatar.png';
        }

        // If it's a Firebase Storage URL or external
        if (photoURL && (photoURL.startsWith('http://') || photoURL.startsWith('https://'))) {
            return photoURL;
        }

        // If no photoURL is set, return null (so we show initials instead)
        return null;
    };

    const getInitials = (user) => {
        const name = user.displayName || user.email || '';
        return name.charAt(0).toUpperCase();
    };


    return (
        <div className="mb-6 relative">
            <div className="flex items-center bg-[#2b2c3f] rounded-3xl px-4 py-2">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="w-full bg-transparent text-sm text-white placeholder-gray-400 outline-none"
                />
            </div>

            {searchTerm && (
                <div className="absolute mt-2 w-full bg-[#1e1e2f] rounded-md shadow-lg z-10 max-h-64 overflow-y-auto border border-gray-700">
                    {loading && (
                        <div className="p-3 text-gray-400 text-sm">Searching...</div>
                    )}

                    {!loading && results.length === 0 && (
                        <div className="p-3 text-gray-400 text-sm">No users found</div>
                    )}

                    {!loading && results.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => onUserSelect(user)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-800"
                        >
                            {getAvatarSrc(user) ? (
                                <img
                                src={getAvatarSrc(user)}
                                alt="avatar"
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => { e.target.src = '/default-avatar.png'; }}
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                {getInitials(user)}
                                </div>
                            )}

                            <div className="text-white">
                                <p className="font-medium text-sm">
                                    {user.displayName || "Unnamed"}
                                    {currentUser?.uid === user.id && <span className="ml-1 text-xs text-indigo-400">(You)</span>}
                                </p>

                                <p className="text-xs text-gray-400">~{user.email}</p>
                            </div>
                        </div>

                    ))}
                </div>
            )}

        </div>
    );
};

export default UserSearch;
