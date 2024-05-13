"use client";

import { useEffect, useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { User } from "@prisma/client";

export default function Contacts() {
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
      <div className="flex h-screen flex-col">
        <div className="fixed top-0 z-10 w-full bg-white p-4 shadow-md">
          <div className="flex items-center justify-between">
            <IconButton className="rounded-full bg-blue-500 p-2 text-white">
              <SearchIcon />
            </IconButton>
            <Button className="rounded bg-blue-500 px-4 py-2 text-white">
              + Create New Chat
            </Button>
          </div>
          <div className="mt-0 flex justify-center space-x-10">
            <Button className="rounded px-3 py-1 text-gray-500">All</Button>
            <Button className="rounded px-3 py-1 text-gray-500">Unread</Button>
            <Button className="rounded px-3 py-1 text-gray-500">Read</Button>
            <Button className="rounded px-3 py-1 text-gray-500">Pinned</Button>
          </div>
        </div>
        <div className="mt-4 flex-1 overflow-auto bg-gray-100 pb-16 pt-24">
          {users.map((user) => (
            <div
              key={user.id}
              className="mb-2 flex items-center justify-between rounded-lg bg-white p-2 shadow"
            >
              <div className="flex items-center">
                <div className="mr-4 h-12 w-12 rounded-full bg-gray-300"></div>
                <div>
                  <h1 className="font-bold text-black">{user.firstName}</h1>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <p className="text-black">
                  {user.lastMessageTime || "No message time"}
                </p>
                {user.isOnline && (
                  <span className="h-3 w-3 rounded-full bg-green-500"></span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 z-10 flex w-full justify-between bg-white p-4 shadow-md">
          <IconButton className="rounded-full bg-blue-500 p-3 text-white">
            <ChatIcon />
          </IconButton>
          <IconButton className="rounded-full bg-blue-500 p-3 text-white">
            <NotificationsIcon />
          </IconButton>
          <IconButton className="rounded-full bg-blue-500 p-3 text-white">
            <SettingsIcon />
          </IconButton>
        </div>
      </div>
    </>
  );
}
