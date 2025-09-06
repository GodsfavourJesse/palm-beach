import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy } from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";

const inviteLink = "https://palm-beach-one.vercel.app"; // your actual link
const inviteMessage = `Join me here on this amazing platform I build for connecting with friends! 🌴 ${inviteLink}`;

const platforms = [
    {
        name: "WhatsApp",
        url: `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`,
        icon: <FaWhatsapp className="text-white text-2xl" />,
        bg: "from-green-400 to-green-600",
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com/", // Instagram doesn’t support direct text share via URL
        icon: <FaInstagram className="text-white text-2xl" />,
        bg: "from-pink-400 to-purple-500",
    },
    {
        name: "TikTok",
        url: "https://www.tiktok.com/", // TikTok doesn’t support direct text share via URL
        icon: <FaTiktok className="text-white text-2xl" />,
        bg: "from-gray-800 to-black",
    },
    {
        name: "Twitter",
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(inviteMessage)}`,
        icon: <FaTwitter className="text-white text-2xl" />,
        bg: "from-sky-400 to-sky-600",
    },
    {
        name: "Facebook",
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`,
        icon: <FaFacebook className="text-white text-2xl" />,
        bg: "from-blue-400 to-blue-700",
    },
];

const InviteFriendsMenu = ({ onClose }) => {
    const [translateY, setTranslateY] = useState(0);
    const [copied, setCopied] = useState(false);
    const startY = useRef(null);

    // Touch drag-to-close
    const handleTouchStart = (e) => {
        startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        if (startY.current !== null) {
        const diff = e.touches[0].clientY - startY.current;
        if (diff > 0) setTranslateY(diff);
        }
    };
    const handleTouchEnd = () => {
        if (translateY > 150) {
        onClose();
        }
        setTranslateY(0);
        startY.current = null;
    };

    // Copy invite link
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex justify-center items-end md:items-center"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="w-full md:w-[450px] bg-white/20 backdrop-blur-2xl rounded-t-3xl md:rounded-3xl shadow-2xl p-6 border border-white/30"
                    style={{ transform: `translateY(${translateY}px)` }}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Drag handle (mobile) */}
                    <div className="w-12 h-1.5 bg-gray-300/70 rounded-full mx-auto mb-4 md:hidden"></div>

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white/90 tracking-tight">
                            Invite Friends
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/30 hover:bg-white/50 transition"
                        >
                            <X size={20} className="text-gray-700" />
                        </button>
                    </div>

                    {/* Platforms grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {platforms.map((platform, i) => (
                            <motion.a
                                key={platform.name}
                                href={platform.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex flex-col items-center justify-center rounded-2xl p-3 bg-gradient-to-br ${platform.bg} text-white shadow-lg`}
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                onClick={onClose}
                            >
                                {platform.icon}
                                <span className="mt-2 text-sm font-medium">{platform.name}</span>
                            </motion.a>
                        ))}
                    </div>

                    {/* Copy link button */}
                    <button
                        onClick={handleCopy}
                        className="w-full mt-6 py-3 rounded-2xl flex items-center justify-center gap-2 bg-white/80 hover:bg-white/50 text-gray-900 font-medium transition shadow-md"
                    >
                        <Copy size={18} />
                        {copied ? "Link Copied!" : "Copy Invite Link"}
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InviteFriendsMenu;
