import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { FaSearch } from "react-icons/fa";
import { avatarMap } from "../../assets/assets";

const UserSearch = ({ onUserSelect }) => {
    const [searchTerm, setSearchTerm] = useState("");
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
            const usersRef = collection(db, "users");
            const snapshot = await getDocs(usersRef);

            const filtered = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter(
                (user) =>
                user.displayNameLower?.includes(lowerTerm) // ✅ only match by displayName
            );

            setResults(filtered);
        } catch (error) {
            console.error("Search error:", error);
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
        const { photoURL } = user;

        if (photoURL && photoURL.startsWith("/src/assets/avatars/")) {
            return avatarMap[photoURL] || "/default-avatar.png";
        }

            if (photoURL && (photoURL.startsWith("http://") || photoURL.startsWith("https://"))) {
            return photoURL;
        }

        return null;
    };

    const getInitials = (user) => {
        const name = user.displayName || user.email || "";
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className="mb-4 relative">
            {/* Search Input */}
            <div 
                className="flex items-center bg-gray-100 rounded-xl px-3 py-2 shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 transition"
            >
                <FaSearch className="text-gray-400 mr-2" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                />
            </div>

            {/* Search Results Dropdown */}
            {searchTerm && (
                <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg z-20 max-h-72 overflow-y-auto border border-gray-200 animate-fadeIn">
                    {loading && (
                        <div className="p-3 text-gray-500 text-sm">Searching...</div>
                    )}

                    {!loading && results.length === 0 && (
                        <div className="p-3 text-gray-500 text-sm">No users found</div>
                    )}

                    {!loading &&
                        results.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => onUserSelect(user)}
                                className="flex items-center gap-3 p-3 hover:bg-indigo-50 cursor-pointer transition border-b border-gray-100 last:border-none"
                            >
                                {getAvatarSrc(user) ? (
                                    <img
                                        src={getAvatarSrc(user)}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                                        onError={(e) => {
                                        e.target.src = "/default-avatar.png";
                                        }}
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                        {getInitials(user)}
                                    </div>
                                )}

                                <div className="flex flex-col">
                                    <p className="font-medium text-gray-900 text-sm flex items-center">
                                        {user.displayName || "Unnamed"}
                                        {currentUser?.uid === user.id && (
                                        <span className="ml-1 text-xs text-indigo-500 font-medium">
                                            (You)
                                        </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        @{user.displayName?.toLowerCase().replace(/\s+/g, "_") || "user"}
                                    </p>
                                </div>
                            </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserSearch;
