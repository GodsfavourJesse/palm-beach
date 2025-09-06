import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    collection,
    getDocs,
    query as fsQuery,
    startAfter,
    limit,
    where,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { ArrowLeft, Search, MessageCircle } from "lucide-react";
import { avatarMap } from "../../assets/assets";

const PAGE_SIZE = 20;

const gradients = [
    "bg-gradient-to-r from-indigo-500 to-purple-500",
    "bg-gradient-to-r from-pink-500 to-rose-500",
    "bg-gradient-to-r from-green-500 to-emerald-500",
    "bg-gradient-to-r from-yellow-500 to-orange-500",
    "bg-gradient-to-r from-red-500 to-pink-500",
    "bg-gradient-to-r from-blue-500 to-cyan-500",
    "bg-gradient-to-r from-purple-500 to-pink-500",
    "bg-gradient-to-r from-teal-500 to-green-500",
];

const getGradientForUser = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
};

const shuffleArray = (arr) => {
    return arr
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);
};

const SearchUsersPage = ({ onBack, onUserSelect }) => {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const currentUser = auth.currentUser;
    const observer = useRef();

    const fetchUsers = async (reset = false) => {
        if (reset) {
            setUsers([]);
            setLastDoc(null);
            setHasMore(true);
        }

        if (!hasMore && !reset) return;

        const constraints = [limit(PAGE_SIZE)];

        if (debouncedQuery) {
            const searchTerm = debouncedQuery.toLowerCase();
            constraints.unshift(
                where("displayNameLower", ">=", searchTerm),
                where("displayNameLower", "<=", searchTerm + "\uf8ff")
            );
        }

        if (lastDoc && !reset) {
            constraints.push(startAfter(lastDoc));
        }

        try {
            if (reset) setLoading(true);
            else setLoadingMore(true);

            const snap = await getDocs(fsQuery(collection(db, "users"), ...constraints));
            let list = snap.docs.map((doc) => ({
                uid: doc.id, // ✅ normalize to uid
                ...doc.data(),
            }));

            list = currentUser
                ? list.filter((u) => u.uid !== currentUser.uid)
                : list;

            list = shuffleArray(list);

            setUsers((prev) => (reset ? list : [...prev, ...list]));
            setLastDoc(snap.docs[snap.docs.length - 1] || null);
            setHasMore(snap.docs.length === PAGE_SIZE);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(query.trim()), 400);
        return () => clearTimeout(t);
    }, [query]);

    useEffect(() => {
        fetchUsers(true);
    }, [debouncedQuery]);

    const lastUserRef = useCallback(
        (node) => {
            if (loadingMore) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                fetchUsers();
                }
            });

            if (node) observer.current.observe(node);
        },
        [loadingMore, hasMore]
    );

    const getAvatarSrc = (user) => {
        const photo = user.photoURL || user.profilePicture || user.photo || "";
        if (!photo) return null;
        if (avatarMap && avatarMap[photo]) return avatarMap[photo];
        if (/^https?:\/\//.test(photo) || photo.startsWith("data")) return photo;
        return avatarMap?.[photo] || null;
    };

    const renderHandle = (user) => {
        if (user.username) return `@${user.username.replace(/\s+/g, "_")}`;
        if (user.displayNameLower) return `@${user.displayNameLower}`;
        if (user.email) return `@${user.email.split("@")[0]}`;
        return "@user";
    };

    return (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 p-5 overflow-y-auto">
            <div className="flex items-center gap-4 mb-5">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                    aria-label="Back"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">Search users</h2>
                    <p className="text-xs text-gray-500">Browse everyone on Palm Bridge</p>
                </div>
            </div>

            <div className="relative mb-6">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by full name or username…"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading users…</p>
            ) : (
                <>
                <div className="max-w-md mx-auto grid gap-3">
                    {users.map((user, idx) => {
                        const name = user.displayName || user.name || user.email || "Unnamed";
                        const avatar = getAvatarSrc(user);

                        return (
                            <div
                                key={user.uid}
                                ref={idx === users.length - 1 ? lastUserRef : null}
                                onClick={() => onUserSelect(user)}
                                className="flex items-center gap-2 p-3 rounded-xl bg-white hover:bg-indigo-50 transition shadow-sm border border-gray-100"
                            >
                                {avatar ? (
                                    <img
                                        src={avatar}
                                        alt={name}
                                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${getGradientForUser(
                                            user.uid
                                        )}`}
                                    >
                                        {name.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{name}</p>
                                    <p className="text-sm text-gray-500 truncate">{renderHandle(user)}</p>
                                </div>

                                <button
                                    className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition"
                                >
                                    <MessageCircle size={18} />
                                </button>
                            </div>
                        );
                    })}

                    {users.length === 0 && (
                        <p className="text-center text-gray-500 py-10">No users found</p>
                    )}
                </div>

                {loadingMore && <p className="text-center text-gray-400">Loading more…</p>}
                </>
            )}
        </div>
    );
};

export default SearchUsersPage;
