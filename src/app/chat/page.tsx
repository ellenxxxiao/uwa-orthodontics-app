"use client";

import { useState, useEffect } from "react";
import { Message } from "@prisma/client";
import { LuSendHorizonal } from "react-icons/lu";
import SendIcon from "@mui/icons-material/Send";
import Header from "../components/Header";
import Input from "../components/Input";

export default function Home() {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const currentUserId = "currentUserId";

  const fetchMessages = async () => {
    const res = await fetch("/api/chat");
    const chat = await res.json();
    setMsgs(chat);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header
        type="secondary"
        title={"Ellen Xiao"}
        firstName={"Ellen"}
        lastName={"Xiao"}
        avatar={""}
      />

      {/* Messages */}
      <div className="w-full flex-1 bg-base100"></div>

      {/* Input */}
      <div className="w-full h-20 bg-app-white flex justify-between py-4 px-4 gap-8">
        <Input label="Message" placeholder="Type your message" />
        <button>
          <LuSendHorizonal
            size={30}
            strokeWidth={1.6}
            className="text-primary"
          />
        </button>
      </div>
    </div>
  );
}
