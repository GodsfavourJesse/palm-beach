import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/outfit";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/700.css";

import { registerSW } from "virtual:pwa-register";

function Root() {
    const [needRefresh, setNeedRefresh] = useState(false);
    const [updateSW, setUpdateSW] = useState(null);

    useEffect(() => {
        const updateFn = registerSW({
            immediate: true,
            onNeedRefresh() {
                console.log("⚡ New version available!");

                // Get current SW version from localStorage
                const lastDismissedVersion = localStorage.getItem("dismissedSWVersion");

                // Generate a "version key" (can be SW timestamp)
                const versionKey = Date.now().toString();

                if (lastDismissedVersion !== versionKey) {
                    localStorage.setItem("currentSWVersion", versionKey);
                    setNeedRefresh(true);
                }
            },
            onOfflineReady() {
                console.log("✅ App ready to work offline!");
            },
        });
        setUpdateSW(() => updateFn);
    }, []);

    const handleRefresh = () => {
        if (updateSW) updateSW(true); // apply new SW
        setNeedRefresh(false);
    };

    const handleDismiss = () => {
        // Save dismissed version so banner won’t show until next SW update
        const currentVersion = localStorage.getItem("currentSWVersion");
        if (currentVersion) {
            localStorage.setItem("dismissedSWVersion", currentVersion);
        }
        setNeedRefresh(false);
    };

    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>

            {needRefresh && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 z-50">
                    <span>🔄 New update available</span>
                    <button
                        onClick={handleRefresh}
                        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md"
                    >
                        Refresh Now
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-md"
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);