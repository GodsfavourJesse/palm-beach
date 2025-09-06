import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

// 🔹 Get user background
export const getUserBackground = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "userPreferences", uid));
    return userDoc.exists()
      ? userDoc.data().background || { index: 0, customImage: null }
      : { index: 0, customImage: null };
  } catch (error) {
    console.error("Error fetching user background:", error);
    return { index: 0, customImage: null };
  }
};

// 🔹 Save background to Firestore
export const saveUserBackground = async (uid, background) => {
  try {
    await setDoc(doc(db, "userPreferences", uid), { background }, { merge: true });
  } catch (error) {
    console.error("Error saving user background:", error);
  }
};

// 🔹 Get recent chats
export const getRecentChats = (user, callback) => {
  if (!user) return;

  const q = query(
    collection(db, "messages"),
    where("participants", "array-contains", user.uid),
    orderBy("timestamp", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp ?? null,
      };
    });

    const chatsMap = new Map();
    messages.forEach((msg) => {
      const otherUser = msg.senderId === user.uid ? msg.receiverId : msg.senderId;
      if (!chatsMap.has(otherUser)) {
        chatsMap.set(otherUser, msg);
      }
    });

    const recent = Array.from(chatsMap.values());
    callback(recent);
  });
};

// 🔹 Get messages between 2 users
export const getMessagesBetweenUsers = (user, selectedUser, callback) => {
  if (!user || !selectedUser) return;

  const q = query(
    collection(db, "messages"),
    where("participants", "array-contains", user.uid),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const allMessages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const filtered = allMessages.filter(
      (msg) =>
        (msg.senderId === user.uid && msg.receiverId === selectedUser.uid) ||
        (msg.receiverId === user.uid && msg.senderId === selectedUser.uid)
    );
    callback(filtered);
  });
};

// 🔹 Send message
export const sendMessage = async (sender, receiver, text) => {
  if (!sender?.uid || !receiver?.uid) {
    throw new Error("Invalid sender/receiver");
  }

  const message = {
    text,
    senderId: sender.uid,
    receiverId: receiver.uid,
    timestamp: serverTimestamp(),
    participants: [sender.uid, receiver.uid],
    seen: false,
  };

  try {
    await addDoc(collection(db, "messages"), message);
  } catch (err) {
    console.error("Error sending message:", err);
    throw new Error("Failed to send message");
  }
};

// 🔹 Update user online status
export const setUserOnlineStatus = async (userId, isOnline) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      isOnline,
      lastSeen: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating online status:", error);
  }
};

// 🔹 Track real-time user status
export const subscribeToUserStatus = (userId, callback) => {
  const ref = doc(db, "users", userId);
  let offlineTimer = null;

  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback({ isOnline: false, state: "offline" });
      return;
    }

    const data = snap.data();
    const status = {
      isOnline: data.isOnline ?? false,
      lastSeen: data.lastSeen?.toDate?.() || null,
      state: data.state || "offline",
    };

    if (status.isOnline) {
      if (offlineTimer) {
        clearTimeout(offlineTimer);
        offlineTimer = null;
      }
      callback(status);
    } else {
      if (offlineTimer) clearTimeout(offlineTimer);
      offlineTimer = setTimeout(() => {
        callback(status);
      }, 10000);
    }
  });
};

// 🔹 Update user state (e.g., "typing", "away")
export const updateUserStatusState = async (userId, state) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { state });
  } catch (error) {
    console.error("Failed to update status state:", error);
  }
};

// 🔹 Setup user presence
export const setupUserPresence = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    // Mark online
    updateDoc(userRef, { isOnline: true });

    const setOffline = () => {
      updateDoc(userRef, {
        isOnline: false,
        lastSeen: serverTimestamp(),
      });
    };

    window.addEventListener("beforeunload", setOffline);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        setOffline();
      }
    });
  });
};

// 🔹 Subscribe to stories
export const subscribeToStories = (callback) => {
  const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const stories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(stories);
  });
};

// 🔹 Add a new story
export const addStory = async (user, imageUrl) => {
  try {
    await addDoc(collection(db, "stories"), {
      userId: user.uid,
      username: user.displayName || "Unknown",
      imageUrl,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error adding story:", err);
    throw err;
  }
};
