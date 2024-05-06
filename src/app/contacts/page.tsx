"use client";

import { useState, useEffect } from "react";
import { Message } from "@prisma/client";

export default function Home() {
  const [msgs, setMsgs] = useState<Message[]>([]);

  const fetchMessages = async () => {
    const res = await fetch("/api/chat");
    const chat = await res.json();
    setMsgs(chat);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <h1>
      {msgs &&
        msgs.map((msg) => (
          <div key={msg.id}>
            <h1>{msg.senderId}</h1>
            <h2>{msg.receiverId}</h2>
            <p>{msg.text}</p>
            <p className="bg-red-100">{msg.status}</p>
          </div>
        ))}
    </h1>
  );
}
