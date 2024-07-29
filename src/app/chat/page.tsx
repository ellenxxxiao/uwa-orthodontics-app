"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Message, User } from "@prisma/client";
import { LuBell, LuChevronLeft } from "react-icons/lu"; // Import icons in a single line if from the same source
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
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(true); // control request

  const fetchMessages = async () => {
    const res = await fetch("/api/chat");
    const messages = await res.json();
    setMsgs(messages);
  };

  const fetchUsers = async () => {
    const resUser = await fetch(`/api/users/${currentUserId}`);
    const user = await resUser.json();

    const resOtherUser = await fetch(`/api/users/${otherUserId}`);
    const otherUser = await resOtherUser.json();
    setUser(user);
    setOtherUser(otherUser);
  };

  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchMessages();
    fetchUsers();
    return () => setIsMounted(false);
  }, []); // control request

  // Polling. Not the best way to do it, but it works for now.
  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 500);

    return () => clearInterval(intervalId);
  }, [isMounted]);

  const handleBackClick = () => {
    setIsMounted(false); // shut dowm when leave
    router.push("/chat-list");
  };

  return (
    <div className="flex h-screen flex-col">
      <Header
        type="secondary"
        iconLeft={
          <LuChevronLeft
            size={35}
            strokeWidth={1.2}
            className="text-app-white"
            onClick={handleBackClick}
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
      <div className="w-full flex-1 overflow-y-auto bg-base-100">
        <div className="mx-4 my-6 flex flex-col gap-6 text-app-black">
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
      <div className="flex h-20 w-full justify-between gap-8 bg-app-white px-4 py-4">
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
