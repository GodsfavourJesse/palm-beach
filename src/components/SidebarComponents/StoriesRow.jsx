import React, { useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaPlus } from "react-icons/fa";
import { db } from "../../firebase/firebase";


export default function StoriesRow({ currentUser }) {
  const [stories, setStories] = useState([]);

  // Fetch stories from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "stories"), (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStories(fetched.filter(story => story.userId !== currentUser.uid)); // exclude self
    });
    return () => unsub();
  }, [currentUser]);

  // Add Story
  const handleAddStory = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Upload file to Firebase Storage
    const storageRef = ref(storage, `stories/${currentUser.uid}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    // Save story in Firestore
    await addDoc(collection(db, "stories"), {
      userId: currentUser.uid,
      photoURL: url,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="flex space-x-4 p-3 overflow-x-auto no-scrollbar">
      {/* Add Story */}
      <label className="flex flex-col items-center cursor-pointer">
        <div className="w-16 h-16 rounded-full border-2 border-indigo-500 flex items-center justify-center bg-gray-200">
          <FaPlus className="text-indigo-600 text-lg" />
        </div>
        <input type="file" accept="image/*,video/*" hidden onChange={handleAddStory} />
        <span className="text-xs mt-1">Add Story</span>
      </label>

      {/* Other Users' Stories */}
      {stories.length > 0 && stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center cursor-pointer">
          <img
            src={story.photoURL}
            alt="story"
            className="w-16 h-16 rounded-full border-2 border-indigo-500 object-cover"
          />
          <span className="text-xs mt-1">{story.username || "User"}</span>
        </div>
      ))}
    </div>
  );
}
