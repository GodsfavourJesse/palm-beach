import React from "react";
import { Home, Settings, User } from "lucide-react";
import { FaUser } from "react-icons/fa";

const SidebarFooter = ({ onNewChat, onOpenInfo }) => {
  return (
    <div className="flex justify-around items-center border-t border-gray-200 p-3 bg-white fixed bottom-0 left-0 w-full">
      <button className="flex flex-col items-center text-gray-600 hover:text-indigo-600">
        <Home size={20} />
        <span className="text-xs">Home</span>
      </button>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="flex flex-col items-center text-white bg-indigo-700 rounded-full px-6 py-2"
      >
        + New Chat
      </button>

      <button
        onClick={onOpenInfo}
        className="flex flex-col items-center text-gray-600 hover:text-indigo-600"
      >
        <User size={20} />
        <span className="text-xs">Profile</span>
      </button>
    </div>
  );
};

export default SidebarFooter;
