"use client";
import { LuChevronLeft, LuBell } from "react-icons/lu"; // Import icons in a single line if from the same source
import { useState, useEffect } from "react";
import { Message, User } from "@prisma/client";
import { LuSendHorizonal } from "react-icons/lu";
import Header from "../components/Header";
import Input from "../components/Input";
import MessageBubble from "../components/MessageBubble";
import { IDs } from "../api/chat/route";

export default function Home() {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const currentUserId = IDs.senderId;
  const otherUserId = IDs.receiverId;
  const [user, setUser] = useState({} as User);
  const [otherUser, setOtherUser] = useState({} as User);

  const fetchMessages = async () => {
    const res = await fetch("/api/chat");
    const messages = await res.json();
    setMsgs(messages);
  };

  const fetchUsers = async () => {
    const resUser = await fetch(`/api/user/${currentUserId}`);
    const user = await resUser.json();

    const resOtherUser = await fetch(`/api/user/${otherUserId}`);
    const otherUser = await resOtherUser.json();
    setUser(user);
    setOtherUser(otherUser);
  };

  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, []);

  // Polling. Not the best way to do it, but it works for now.
  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header
        type="secondary"
        iconLeft={
          <LuChevronLeft
            size={35}
            strokeWidth={1.2}
            className="text-app-white"
          />
        }
        iconRight={
          <LuBell size={30} strokeWidth={1.2} className="text-app-white" />
        }
        title={
          otherUser && otherUser.firstName
            ? `${otherUser.firstName} ${otherUser.lastName}`
            : "Loading..."
        }
        firstName={otherUser.firstName || ""}
        lastName={otherUser.lastName || ""}
        avatar={""}
      />

      {/* Messages */}
      <div className="w-full flex-1 bg-base-100 overflow-y-auto">
        <div className="my-6 mx-4 text-app-black flex flex-col gap-6">
          {msgs.map((msg) => (
            <MessageBubble
              key={msg.id.toString()}
              text={msg.text}
              isSender={msg.senderId === currentUserId}
              time={msg.sentAt}
              showTime={true}
            />
          ))}
        </div>
      </div>

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
