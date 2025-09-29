import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import "@fontsource/outfit"; // Defaults to 400 (Regular)
import "@fontsource/outfit/300.css"; // Light
import "@fontsource/outfit/500.css"; // Medium
import "@fontsource/outfit/700.css"; // Bold
import { BrowserRouter } from "react-router-dom";

// PWA service worker
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("New version available! Reload?")) {
            updateSW(true);
        }
    },
    onOfflineReady() {
        console.log("App ready to work offline!");
    },
});

// ✅ Register Firebase Messaging service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
            console.log("Firebase Messaging SW registered:", registration);
        })
        .catch((err) =>
            console.error("Firebase Messaging SW registration failed:", err)
        );
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);