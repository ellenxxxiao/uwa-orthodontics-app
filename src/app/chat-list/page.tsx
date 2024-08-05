"use client";

import { useEffect,useState } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { LuPenSquare, LuSearch } from "react-icons/lu";

import Footer from "../components/Footer";
import Header from "../components/Header";

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

export default function Home() {
  const router = useRouter();

  // Define the user list with ChatUser type
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/chat-list/0d7e9ae9-dcd9-4bc9-8908-1715778cfaf9");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: ChatUser[] = await response.json(); // Type assertion
        setUsers(data);
      } catch (error){
        if (process.env.NODE_ENV !== 'production') {
          throw new Error("Failed to fetch users");
        }
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    if (filter === "all") return true;
    return filter === "unread" ? !user.lastMessage.read : user.lastMessage.read;
  });

  // Function to format the date into a relative time string
  const formatRelativeTime = (sentAt: string) => {
    const now = new Date();
    const sentDate = new Date(sentAt);
    const diffInSeconds = Math.floor((now.getTime() - sentDate.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
    }
  };

  const handleChatClick = (userId: string) => {
    // Pass user ID to the chat page
    router.push(`/chat/${userId}`);
  };

  return (
    <>
      <div className="flex h-screen flex-col">
        <Header
          type="primary"
          iconLeft={<LuSearch size={30} strokeWidth={1.3} className="text-primary" />}
          iconRight={<LuPenSquare size={30} strokeWidth={1.3} className="text-primary" />}
          title="Contacts"
        />

        {/* Main content */}
        <div className="w-full flex-1 flex flex-col overflow-hidden bg-base-100">
          <div className="flex justify-around bg-white p-4 shadow-md">
            <button
              className={`py-2 px-4 rounded-full ${filter === "all" ? "bg-blue-500 text-white" : "text-blue-500"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`py-2 px-4 rounded-full ${filter === "unread" ? "bg-blue-500 text-white" : "text-blue-500"}`}
              onClick={() => setFilter("unread")}
            >
              Unread
            </button>
            <button
              className={`py-2 px-4 rounded-full ${filter === "read" ? "bg-blue-500 text-white" : "text-blue-500"}`}
              onClick={() => setFilter("read")}
            >
              Read
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {filteredUsers.map(user => (
              <div
                role="button" 
                tabIndex={0}
                key={user.contactUser.id} 
                className="flex items-center mb-4 p-4 bg-white rounded-lg shadow relative cursor-pointer" 
                onClick={() => handleChatClick(user.contactUser.id)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleChatClick(user.contactUser.id);
                  }
                }}
              >
                {filter === "all" && !user.lastMessage.read && (
                  <div className="absolute left-0 w-3 h-3 bg-blue-500 rounded-full ml-3"></div>
                )}
                <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 ml-4 relative">
                  {/* Placeholder for user image */}
                  <Image src="/path/to/user/image" alt="User" className="w-full h-full object-cover rounded-full" layout="responsive" width={1} height={1}/>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 
                      className="font-bold text-lg text-black truncate w-32" // Limit name length
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '8rem'
                      }}
                    >
                      {user.contactUser.firstName} {user.contactUser.lastName}
                    </h3>
                    <span className="text-gray-500 text-sm">{formatRelativeTime(user.lastMessage.sentAt)}</span>
                  </div>
                  <p 
                    className="text-gray-600 truncate w-48" // Limit message length
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '12rem'
                    }}
                  >
                    {user.lastMessage.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
