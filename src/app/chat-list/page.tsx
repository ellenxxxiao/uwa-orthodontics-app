"use client";

import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { LuPenSquare, LuSearch } from "react-icons/lu";

import Footer from "../components/Footer";
import Header from "../components/Header";

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
        <div className="w-full flex-1 overflow-y-auto bg-base-100"></div>

        {/* footer */}
        <Footer />
      </div>
    </>
  );
}
