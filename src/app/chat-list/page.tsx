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
    { id: 1, name: "Alian Haidar", time: "3:40 PM", message: "Hi Dr. Lee, when do I change my upper a...", status: "unread", isOnline: true },
    { id: 2, name: "Ellen Xiao", time: "2:59 PM", message: "Bring it with you and we can have a look...", status: "unread", isOnline: false },
    { id: 3, name: "Zimu Zhang", time: "Yesterday", message: "See you then!", status: "read", isOnline: true },
    { id: 4, name: "Neha", time: "Monday", message: "Your next appointment is next Friday at...", status: "read", isOnline: false },
    { id: 5, name: "Runtian Liang", time: "12/4/2024", message: "Thank you. Take care!", status: "read", isOnline: true }
  ]);
  const [filter, setFilter] = useState("all");

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  const filteredUsers = users.filter(user => {
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
          iconLeft={<LuSearch size={30} strokeWidth={1.3} className="text-primary" />}
          iconRight={<LuPenSquare size={30} strokeWidth={1.3} className="text-primary" />}
          title="Contacts"
        />

        {/* main */}
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
              <div key={user.id} className="flex items-center mb-4 p-4 bg-white rounded-lg shadow relative cursor-pointer" onClick={handleChatClick}>
                {filter === "all" && user.status === "unread" && (
                  <div className="absolute left-0 w-3 h-3 bg-blue-500 rounded-full ml-3"></div>
                )}
                <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 ml-4 relative">
                  {/* Placeholder for user image */}
                  <img src="/path/to/user/image" alt="User" className="w-full h-full object-cover rounded-full" />
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-black">{user.name}</h3>
                    <span className="text-gray-500 text-sm">{user.time}</span>
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
