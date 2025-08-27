import React, { useEffect, useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage, db } from '../../firebase/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { updateProfile, updateEmail } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaPen, FaBell, FaLanguage, FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import AvatarSelector from '../../components/AvatarSelector';
import {avatarMap} from '../../assets/assets' // ✅ import avatar map

const EditProfile = () => {
    const [user] = useAuthState(auth);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);
    const [avatarURL, setAvatarURL] = useState('');
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setName(data.displayName || '');
                    setBio(data.bio || '');
                    setEmail(data.email || '');
                    // ✅ resolve avatarMap if saved value is a path
                    setAvatarURL(avatarMap[data.photoURL] || data.photoURL || '');
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };
        fetchUserData();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);

        try {
            await updateProfile(user, {
                displayName: name,
                photoURL: avatarURL,
            });

            if (email !== user.email) {
                await updateEmail(user, email);
            }

            const userRef = doc(db, 'users', user.uid);
            await setDoc(
                userRef,
                {
                    uid: user.uid,
                    displayName: name,
                    displayNameLower: name.toLowerCase(),
                    email: user.email,
                    emailLower: user.email.toLowerCase(),
                    photoURL: avatarURL, // ✅ store final usable URL
                    bio: bio || '',
                },
                { merge: true }
            );

            toast.success('Profile updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const storageRef = ref(storage, `avatars/${user.uid}/${uuidv4()}`);
        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setAvatarURL(url);
            toast.success('Avatar uploaded!');
        } catch (error) {
            console.error('Avatar upload failed:', error);
            toast.error('Failed to upload avatar.');
        }
    };

    const handleAvatarSelect = (selected) => {
        if (selected) setAvatarURL(selected);
        setShowAvatarSelector(false);
    };

    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
                <p>User not found. Please log in.</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
            {showAvatarSelector && (
                <AvatarSelector onSelect={handleAvatarSelect} onClose={() => setShowAvatarSelector(false)} />
            )}

            <div className="flex flex-col w-full bg-[#212121] overflow-y-auto">
                <div className="flex items-center justify-between text-white p-4 border-b border-gray-800">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="text-gray-200 flex items-center gap-1 hover:text-indigo-400"
                    >
                        <FaPen /> {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>

                <div className="flex flex-col items-center py-8 px-4 relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center text-4xl font-bold uppercase relative group">
                        {avatarURL ? (
                            <img src={avatarURL} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span>{user?.displayName?.charAt(0) || user?.email?.charAt(0)}</span>
                        )}
                        <button
                            onClick={() => setShowAvatarSelector(true)}
                            className="absolute bottom-1 right-1 bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition"
                            title="Change Avatar"
                        >
                            <FaCamera className="text-white" />
                        </button>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                    <p className="mt-4 font-semibold text-center">{user?.displayName}</p>
                    <p className="text-sm text-gray-400">Online</p>
                </div>

                <div className="p-4 space-y-5">
                    <div>
                        <label className="block text-sm mb-1 text-gray-400">Display Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded bg-[#2c2c3f] text-white outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-gray-400">Bio</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded bg-[#2c2c3f] text-white outline-none"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-gray-400">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 rounded bg-[#2c2c3f] text-white outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="px-4 mt-6 space-y-2">
                    <div className="flex items-center gap-4 p-3 cursor-pointer hover:bg-gray-700 rounded-md">
                        <FaBell className="text-gray-400" />
                        <span>Notifications</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 cursor-pointer hover:bg-gray-700 rounded-md">
                        <FaBell className="text-gray-400" />
                        <span>App Display</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 cursor-pointer hover:bg-gray-700 rounded-md">
                        <FaLanguage className="text-gray-400" />
                        <span>Language</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
