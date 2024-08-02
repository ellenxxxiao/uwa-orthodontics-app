"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuPenSquare, LuSearch } from "react-icons/lu";

import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Home() {
  const router = useRouter();
  // data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Alian Haidar",
      time: "3:40 PM",
      message: "Hi Dr. Lee, when do I change my upper a...",
      status: "unread",
      isOnline: true
    },
    {
      id: 2,
      name: "Ellen Xiao",
      time: "2:59 PM",
      message: "Bring it with you and we can have a look...",
      status: "unread",
      isOnline: false
    },
    {
      id: 3,
      name: "Zimu Zhang",
      time: "Yesterday",
      message: "See you then!",
      status: "read",
      isOnline: true
    },
    {
      id: 4,
      name: "Neha",
      time: "Monday",
      message: "Your next appointment is next Friday at...",
      status: "read",
      isOnline: false
    },
    {
      id: 5,
      name: "Runtian Liang",
      time: "12/4/2024",
      message: "Thank you. Take care!",
      status: "read",
      isOnline: true
    }
  ]);
  const [filter, setFilter] = useState("all");

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    return user.status === filter;
  });

  const handleChatClick = () => {
    router.push("/chat");
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
          title="Contacts"
        />

        {/* main */}
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
                key={user.id}
                className="relative mb-4 flex cursor-pointer items-center rounded-lg bg-white p-4 shadow"
                onClick={handleChatClick}
              >
                {filter === "all" && user.status === "unread" && (
                  <div className="absolute left-0 ml-3 h-3 w-3 rounded-full bg-blue-500"></div>
                )}
                <div className="relative ml-4 mr-4 h-16 w-16 rounded-full bg-gray-200">
                  {/* Placeholder for user image */}
                  <img
                    src="/path/to/user/image"
                    alt="User"
                    className="h-full w-full rounded-full object-cover"
                  />
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-black">
                      {user.name}
                    </h3>
                    <span className="text-sm text-gray-500">{user.time}</span>
                  </div>
                  <p className="text-gray-600">{user.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* footer */}
        <Footer />
      </div>
    </>
  );
}
