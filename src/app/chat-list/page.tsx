"use client";

import Header from "../components/Header";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { LuSearch, LuPenSquare } from "react-icons/lu";

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
        <div className="w-full flex-1 bg-base-100 overflow-y-auto"></div>
      </div>
    </>
  );
}
