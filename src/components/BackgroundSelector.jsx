import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Upload, ImageIcon } from 'lucide-react';

const predefinedBackgrounds = [
    {
      name: 'dark',
      className: 'bg-[#000000]',
      textColor: 'text-white'
    },
    {
        name: 'Light',
        className: 'bg-white',
        textColor: 'text-gray-800'
    },
    // {
    //     name: 'Tropical Beach',
    //     className: 'bg-gradient-to-br from-[#FFE29F] via-[#FFA99F] to-[#FF719A]',
    //     textColor: 'text-gray-900'
    // },
    {
        name: 'Sunset Horizon',
        className: 'bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364]',
        textColor: 'text-white'
    },
    // {
    //     name: 'Cool Water + Sky',
    //     className: 'bg-gradient-to-tr from-[#b2fefa] to-[#0ed2f7]',
    //     textColor: 'text-gray-900'
    // },
    // {
    //     name: 'Glassmorphic',
    //     className: 'backdrop-blur-sm bg-white/10',
    //     textColor: 'text-white'
    // },
];

const BackgroundSelector = ({ onChange }) => {
    const [selected, setSelected] = useState(0);
    const [customImage, setCustomImage] = useState(null);

    const user = auth.currentUser;

    useEffect(() => {
        const loadUserBackground = async () => {
        if (!user) return;
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        const data = snap.data();
        if (data?.backgroundIndex !== undefined) {
            setSelected(data.backgroundIndex);
        }
        if (data?.customBackground) {
            setCustomImage(data.customBackground);
        }
        };
        loadUserBackground();
    }, [user]);

    const saveBackgroundToFirebase = async (index, image = null, textColor = 'text-white') => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, {
        backgroundIndex: index,
        customBackground: image || null,
        textColor
    }, { merge: true });
};


const handlePredefinedSelect = (index) => {
    const bg = predefinedBackgrounds[index];
    setSelected(index);
    setCustomImage(null);
    onChange(index, null, bg.textColor);
    saveBackgroundToFirebase(index);
};

const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        const imageUrl = reader.result;
        setCustomImage(imageUrl);
        setSelected(-1);
        onChange(-1, imageUrl, 'text-white'); // default for images
        saveBackgroundToFirebase(-1, imageUrl);
    };
    reader.readAsDataURL(file);
};


return (
    <div className="p-4 text-white space-y-4">
        <h2 className="text-lg font-semibold">Choose Background</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {predefinedBackgrounds.map((bg, index) => (
                <button
                    key={index}
                    className={`h-20 rounded-xl border-2 transition-all duration-300 ${
                    selected === index ? 'border-white scale-105' : 'border-transparent'
                    } ${bg.className}`}
                    onClick={() => handlePredefinedSelect(index)}
                ></button>
            ))}
            <label className="h-20 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all">
            <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
            />
            <Upload size={20} />
            </label>
        </div>
        {customImage && (
            <div className="mt-2">
            <h4 className="text-sm text-gray-400 mb-1">Preview:</h4>
            <img
                src={customImage}
                alt="Custom Background"
                className="rounded-lg w-full max-h-40 object-cover border border-white"
            />
            </div>
        )}
    </div>
  );
};

export const getBackgroundClass = (index, customImage = null) => {
    if (customImage) {
        return `bg-cover bg-center`;
    }
    return predefinedBackgrounds[index]?.className || 'bg-gray-900';
};

export default BackgroundSelector;
