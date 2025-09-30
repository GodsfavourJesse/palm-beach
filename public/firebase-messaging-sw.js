/* eslint-disable no-undef */

// Import Firebase libraries (compat for service workers)
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// Initialize Firebase in the Service Worker
firebase.initializeApp({
    apiKey: "AIzaSyAWTEwa_o41W-HHK2QWLzED3_MhT_J0tas",
    authDomain: "palm-beach-a8b8b.firebaseapp.com",
    projectId: "palm-beach-a8b8b",
    storageBucket: "palm-beach-a8b8b.firebasestorage.app",
    messagingSenderId: "611603495137",
    appId: "1:611603495137:web:0e5fed3f1e8e34d5259fa0",
});

// Retrieve Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message:", payload);

    const notificationTitle = payload.notification?.title || "New Message";
    const notificationOptions = {
        body: payload.notification?.body || "",
        icon: "/pwa-192x192.png", // ensure this file exists in /public
    };

    self.registration.showNotification(notificationTitle, notificationOptions);

    // update badge when background notification recieved
    if ('setAppBadge' in navigator) {
        navigator.setAppBadge(1).catch(console.error);
    }
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow("/home"); // open homepage if no tab is active
        })
    );
});