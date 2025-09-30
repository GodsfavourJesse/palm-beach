import React, { useState } from "react";
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

    // ✅ Register service worker
    const updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
            console.log("⚡ New version available!");
            setNeedRefresh(true);
        },
        onOfflineReady() {
            console.log("✅ App ready to work offline!");
        },
    });

    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>

            {needRefresh && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 z-50">
                    <span>New update available</span>
                    <button
                        onClick={() => updateSW(true)}
                        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md"
                    >
                        Refresh Now
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