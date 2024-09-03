"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LuPenSquare, LuSearch } from "react-icons/lu";

import Header from "@/components/Header";

interface ChatUser {
  contactUser: {
    id: string;
    firstName: string;
    lastName: string;
  };
  lastMessage: {
    text: string;
    sentAt: string; // ISO formatted date string
    read?: boolean; // Assuming the API returns this field
  };
}

export default function ChatList() {
  const { isSignedIn, isLoaded } = useUser();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [filter, setFilter] = useState("all");

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }
    async function fetchUsers() {
      try {
        const response = await fetch(`/api/chat-list/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: ChatUser[] = await response.json(); // Type assertion
        setUsers(data);
      } catch (error) {
        throw new Error("Failed to fetch users");
      }
    }

    isLoaded && fetchUsers();
  }, [isLoaded, isSignedIn, router]);

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    return filter === "unread" ? !user.lastMessage.read : user.lastMessage.read;
  });

  // Function to format the date into a relative time string
  const formatRelativeTime = (sentAt: string) => {
    const now = new Date();
    const sentDate = new Date(sentAt);
    const diffInSeconds = Math.floor(
      (now.getTime() - sentDate.getTime()) / 1000
    );
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
    }
  };

  const handleChatClick = (userId: string) => {
    router.push(`/chat/${userId}`);
  };

  return (
    <>
      <div className="flex h-screen flex-col">
        <Header
          type="primary"
          iconLeft={
            <LuSearch size={30} strokeWidth={1.3} className="text-primary" />
          }
          iconRight={
            <LuPenSquare size={30} strokeWidth={1.3} className="text-primary" />
          }
          title="Chats"
        />

        {/* Main content */}
        <div className="flex w-full flex-1 flex-col overflow-hidden bg-base-100">
          <div className="flex justify-around bg-white p-4 shadow-md">
            <button
              className={`rounded-full px-4 py-2 ${filter === "all" ? "bg-blue-500 text-white" : "text-blue-500"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`rounded-full px-4 py-2 ${filter === "unread" ? "bg-blue-500 text-white" : "text-blue-500"}`}
              onClick={() => setFilter("unread")}
            >
              Unread
            </button>
            <button
              className={`rounded-full px-4 py-2 ${filter === "read" ? "bg-blue-500 text-white" : "text-blue-500"}`}
              onClick={() => setFilter("read")}
            >
              Read
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {filteredUsers.map((user) => (
              <div
                role="button"
                tabIndex={0}
                key={user.contactUser.id}
                className="relative mb-4 flex cursor-pointer items-center rounded-lg bg-white p-4 shadow"
                onClick={() => handleChatClick(user.contactUser.id)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleChatClick(user.contactUser.id);
                  }
                }}
              >
                {filter === "all" && !user.lastMessage.read && (
                  <div className="absolute left-0 ml-3 h-3 w-3 rounded-full bg-blue-500"></div>
                )}
                <div className="relative ml-4 mr-4 h-16 w-16 rounded-full bg-gray-200">
                  {/* Placeholder for user image */}
                  <Image
                    src="/path/to/user/image"
                    alt="User"
                    className="h-full w-full rounded-full object-cover"
                    layout="responsive"
                    width={1}
                    height={1}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className="w-32 truncate text-lg font-bold text-black" // Limit name length
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "8rem"
                      }}
                    >
                      {user.contactUser.firstName} {user.contactUser.lastName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatRelativeTime(user.lastMessage.sentAt)}
                    </span>
                  </div>
                  <p
                    className="w-48 truncate text-gray-600" // Limit message length
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "12rem"
                    }}
                  >
                    {user.lastMessage.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
