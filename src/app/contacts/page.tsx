"use client";

import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Home() {
  // users is an array of User objects
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const chat = await res.json();
    setUsers(chat);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="bg-white fixed top-0 w-full p-4 shadow-md z-10">
          <div className="flex justify-between items-center">
            <IconButton className="p-2 bg-blue-500 rounded-full text-white">
              <SearchIcon />
            </IconButton>
            <Button className="bg-blue-500 text-white py-2 px-4 rounded">
              + Create New Chat
            </Button>
          </div>
          <div className="flex justify-center space-x-10 mt-0">
            <Button className="text-gray-500 px-3 py-1 rounded">All</Button>
            <Button className="text-gray-500 px-3 py-1 rounded">Unread</Button>
            <Button className="text-gray-500 px-3 py-1 rounded">Read</Button>
            <Button className="text-gray-500 px-3 py-1 rounded">Pinned</Button>
          </div>
        </div>
        <div className="flex-1 pt-24 mt-4 pb-16 overflow-auto bg-gray-100"></div>
        <div className="bg-white fixed bottom-0 w-full p-4 shadow-md z-10 flex justify-between">
          <IconButton className="p-3 rounded-full bg-blue-500 text-white">
            <ChatIcon />
          </IconButton>
          <IconButton className="p-3 rounded-full bg-blue-500 text-white">
            <NotificationsIcon />
          </IconButton>
          <IconButton className="p-3 rounded-full bg-blue-500 text-white">
            <SettingsIcon />
          </IconButton>
        </div>
      </div>
    </>
  );
}
