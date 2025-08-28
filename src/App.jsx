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
import ContactsPage from "./pages/SidebarSettings/ContactsPage";
import CallsPage from "./pages/SidebarSettings/CallsPage";
import Settings from "./pages/Settings";
import InviteFriends from "./pages/InviteFriends";
import WelcomePage from "./pages/WelcomePage";

function App() {
    useEffect(() => {
        console.log("Firebase Auth Connected:", auth);
    }, []);

    useEffect(() => {
        const lastLogin = localStorage.getItem("lastLogin");

        if (lastLogin) {
            const diff = Date.now() - parseInt(lastLogin);
            const threeDays = 3 * 24 * 60 * 60 * 1000;

            if (diff > threeDays) {
            auth.signOut();
            localStorage.removeItem("lastLogin");
            }
        }
    }, []);

    return (
        <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/home" element={
                <PrivateRoute>
                    <ChatHome />
                </PrivateRoute>} 
            />
            <Route path="/profile" element={<EditProfile />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/calls" element={<CallsPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/invite-friends" element={<InviteFriends />} />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
