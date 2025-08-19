import React from 'react';
import { FaTimes } from 'react-icons/fa';

// Import all avatars
import avatar_img1 from '../assets/avatars/avatar_img1.webp';
import avatar_img2 from '../assets/avatars/avatar_img2.jpg';
import avatar_img3 from '../assets/avatars/avatar_img3.png';
import avatar_img4 from '../assets/avatars/avatar_img4.png';
import avatar_img5 from '../assets/avatars/avatar_img5.png';
import avatar_img6 from '../assets/avatars/avatar_img6.png';
import avatar_img7 from '../assets/avatars/avatar_img7.png';
import avatar_img8 from '../assets/avatars/avatar_img8.jpg';
import avatar_img9 from '../assets/avatars/avatar_img9.png';
import avatar_img10 from '../assets/avatars/avatar_img10.jpeg';
import avatar_img11 from '../assets/avatars/avatar_img11.jpeg';
import avatar_img12 from '../assets/avatars/avatar_img12.jpeg';
import avatar_img13 from '../assets/avatars/avatar_img13.webp';
import avatar_img14 from '../assets/avatars/avatar_img14.jpg';
import avatar_img15 from '../assets/avatars/avatar_img15.jpg';
import avatar_img16 from '../assets/avatars/avatar_img16.jpg';
import avatar_img17 from '../assets/avatars/avatar_img17.jpg';
import avatar_img18 from '../assets/avatars/avatar_img18.jpg';
import avatar_img19 from '../assets/avatars/avatar_img19.jpg';
import avatar_img20 from '../assets/avatars/avatar_img20.jpg';

const avatarList = [
    { src: avatar_img1, path: "/src/assets/avatars/avatar_img1.webp" },
    { src: avatar_img2, path: "/src/assets/avatars/avatar_img2.jpg" },
    { src: avatar_img3, path: "/src/assets/avatars/avatar_img3.png" },
    { src: avatar_img4, path: "/src/assets/avatars/avatar_img4.png" },
    { src: avatar_img5, path: "/src/assets/avatars/avatar_img5.png" },
    { src: avatar_img6, path: "/src/assets/avatars/avatar_img6.png" },
    { src: avatar_img7, path: "/src/assets/avatars/avatar_img7.png" },
    { src: avatar_img8, path: "/src/assets/avatars/avatar_img8.jpg" },
    { src: avatar_img9, path: "/src/assets/avatars/avatar_img9.png" },
    { src: avatar_img10, path: "/src/assets/avatars/avatar_img10.jpeg" },
    { src: avatar_img11, path: "/src/assets/avatars/avatar_img11.jpeg" },
    { src: avatar_img12, path: "/src/assets/avatars/avatar_img12.jpeg" },
    { src: avatar_img13, path: "/src/assets/avatars/avatar_img13.webp" },
    { src: avatar_img14, path: "/src/assets/avatars/avatar_img14.jpg" },
    { src: avatar_img15, path: "/src/assets/avatars/avatar_img15.jpg" },
    { src: avatar_img16, path: "/src/assets/avatars/avatar_img16.jpg" },
    { src: avatar_img17, path: "/src/assets/avatars/avatar_img17.jpg" },
    { src: avatar_img18, path: "/src/assets/avatars/avatar_img18.jpg" },
    { src: avatar_img19, path: "/src/assets/avatars/avatar_img19.jpg" },
    { src: avatar_img20, path: "/src/assets/avatars/avatar_img20.jpg" },
];



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
                    {avatarList.map((avatar, index) => (
                        <img
                            key={index}
                            src={avatar.src}
                            alt={`Avatar ${index + 1}`}
                            className="w-20 h-20 rounded-full cursor-pointer border-2 border-transparent hover:border-indigo-500"
                            onClick={() => onSelect(avatar.path)} // send only the path
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AvatarSelector;
