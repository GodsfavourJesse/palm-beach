import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const getUserBackground = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'userPreferences', uid));
        return userDoc.exists() ? userDoc.data().background || { index: 0, customImage: null } : { index: 0, customImage: null };
    } catch (error) {
        console.error('Error fetching user background:', error);
        return { index: 0, customImage: null };
    }
};

// Save background to Firestore
export const saveUserBackground = async (uid, background) => {
    try {
        await setDoc(doc(db, 'userPreferences', uid), { background }, { merge: true });
    } catch (error) {
        console.error('Error saving user background:', error);
    }
};


export const getRecentChats = (user, callback) => {
    if (!user) return;

    const q = query(
        collection(db, 'messages'),
        where('participants', 'array-contains', user.uid),
        orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                timestamp: data.timestamp ?? null, // safe fallback
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


export const getMessagesBetweenUsers = (user, selectedUser, callback) => {
    if (!user || !selectedUser) return;

    const q = query(
        collection(db, 'messages'),
        where('participants', 'array-contains', user.uid),
        orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
        const allMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filtered = allMessages.filter(
        (msg) =>
            (msg.senderId === user.uid && msg.receiverId === selectedUser.id) ||
            (msg.receiverId === user.uid && msg.senderId === selectedUser.id)
        );
        callback(filtered);
    });
};

export const sendMessage = async (sender, receiver, text) => {
    const message = {
        text,
        senderId: sender.uid,
        receiverId: receiver.id,
        timestamp: serverTimestamp(),
        participants: [sender.uid, receiver.id],
        seen: false,
    };

    try {
        await addDoc(collection(db, 'messages'), message);
    } catch (err) {
        throw new Error('Failed to send message');
    }
};

// 🔹 Update user online status
export const setUserOnlineStatus = async (userId, isOnline) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            isOnline,
            lastSeen: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating online status:', error);
    }
};

// 🔹 Track real-time online status of another user
export const subscribeToUserStatus = (userId, callback) => {
    const ref = doc(db, 'users', userId);

    return onSnapshot(ref, (snap) => {
        if (snap.exists()) {
            const data = snap.data();
            callback({
                isOnline: data.isOnline ?? false,
                lastSeen: data.lastSeen?.toDate?.() || null,
                state: data.state || 'offline',  // ✅ Make sure this is included
            });
        } else {
        callback({ isOnline: false, state: 'offline' });
        }
    });
};

export const updateUserStatusState = async (userId, state) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { state });
    } catch (error) {
        console.error('Failed to update status state:', error);
    }
};

export const setupUserPresence = () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);

        // When online
        updateDoc(userRef, {
            isOnline: true,
        });

        const setOffline = () => {
            updateDoc(userRef, {
                isOnline: false,
                lastSeen: serverTimestamp(),
            });
        };

        // Set offline on tab close or refresh
        window.addEventListener('beforeunload', setOffline);
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                setOffline();
            }
        });
    });
};
