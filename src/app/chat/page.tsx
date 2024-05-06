"use client";

import { useEffect, useState } from "react";
import { User } from "@prisma/client";

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
      {users &&
        users.map((user) => (
          <div key={user.id}>
            <h1>{user.firstName}</h1>
            <h2>{user.lastName}</h2>
            <p>{user.email}</p>
            <p className="bg-red-100">{user.role}</p>
          </div>
        ))}
    </>
  );
}
