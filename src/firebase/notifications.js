import { Import } from "lucide-react";
import { messaging, db } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import { doc, updateDoc } from "firebase/firestore";
// import { auth } from "./firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// Request permission & get device token
export const requestNotificationPermissionAndSave = async (user) => {
    if (!user) return null;
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Notification permission not granted');
            return null;
        }

        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (token) {
            // Save token on user doc
            await updateDoc(doc(db, 'users', user.uid), { fcmToken: token });
            console.log('Saved token for user:', token);
            return token;
        } else {
            console.warn('No registration token available.');
            return null;
        }
    } catch (err) {
        console.error('Failed to get token', err);
        return null;
    };
};

// Listen for foreground messages
export const onMessageListener = (cb) => {
    return onMessage(messaging, (payload) => {
        console.log('Foreground message', payload);
        if (cb) cb(payload);
    });
};