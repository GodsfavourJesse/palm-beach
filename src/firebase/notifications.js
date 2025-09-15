import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";

const VAPID_KEY = "BIAj9qQtaqt-eZrLGpoQ9ewY_PxZLI3Bo7n9hj2NLg9BWlnvCrs73kS--cm2nYp4cVqbgBeHAlAQyCu-qDLNNY4";

// Request permission & get device token
export const requestNotificationPermission = async () => {
    try {
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (token) {
            console.log("User FCM Token:", token);
            return token;
        } else {
        console.warn("No registration token available.");
        }
    } catch (err) {
        console.error("Error getting token: ", err);
    }
};

// Foreground notifications handler
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
        resolve(payload);
        });
    });
