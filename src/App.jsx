import { useEffect } from "react";
import { auth } from "./firebase/firebase";
import Signup from "./Auth/Signup";
import { Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import ResetPassword from "./Auth/validationComponents/ResetPassword";
import ChatHome from "./pages/Chat/ChatHome";
import PrivateRoute from "./routes/PrivateRoute";
import NotFound from "./Auth/validationComponents/NotFound";
import EditProfile from "./pages/Profile/EditProfile";
import Settings from "./pages/Settings";
import WelcomePage from "./pages/WelcomePage";

import {
    onMessageListener,
    requestNotificationPermissionAndSave,
} from "./firebase/notifications";

import { onAuthStateChanged } from "firebase/auth";

function App() {
    useEffect(() => {
        console.log("Firebase Auth Connected:", auth);
    }, []);

    useEffect(() => {
        const lastLogin = localStorage.getItem("lastLogin");

        if (lastLogin) {
            const diff = Date.now() - parseInt(lastLogin, 10);
            const oneYear = 365 * 24 * 60 * 60 * 1000; //365 days

            if (diff > oneYear) {
                auth.signOut();
                localStorage.removeItem("lastLogin");
            }
        } else {
            // First time login, set timestamp
            localStorage.setItem('lastLogin', Date.now().toString());
        }
    }, []);

  // Foreground push notification handler
    useEffect(() => {
        requestNotificationPermissionAndSave();

        onMessageListener((payload) => {
            console.log("Foreground message received:", payload);
            if (payload.notification) {
                alert(
                    `New Message: ${payload.notification.title} - ${payload.notification.body}`
                );
                new Notification(payload.notification.title, {
                    body: payload.notification.body,
                    icon: '/pwa-192x192.png',
                });
            }
        });
    }, []);

    // Save FCM token when user logs in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await requestNotificationPermissionAndSave(user);
            }
        });
        return unsubscribe;
    }, []);

    return (
        <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
            path="/home"
            element={
                <PrivateRoute>
                    <ChatHome />
                </PrivateRoute>
            }
        />
        <Route path="/profile" element={<EditProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;