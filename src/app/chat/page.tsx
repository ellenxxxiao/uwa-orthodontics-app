"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Message, User } from "@prisma/client";
import { LuBell, LuChevronLeft } from "react-icons/lu";
import { LuSendHorizonal } from "react-icons/lu";

import Header from "../components/Header";
import Input from "../components/Input";
import MessageBubble from "../components/MessageBubble";
import { IDs } from "../api/chat/route";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";

const schema = z.object({
  message: z.string().trim().min(1)
});

export default function Home() {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const currentUserId = IDs.senderId;
  const otherUserId = IDs.receiverId;
  const [user, setUser] = useState({} as User);
  const [otherUser, setOtherUser] = useState({} as User);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(true); // control request

  const chatForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { message: "" }
  });

  const fetchMessages = async () => {
    const res = await fetch("/api/chat");
    const messages = await res.json();
    setMsgs(messages);
  };

  function onSubmit(data: z.infer<typeof schema>, e: any) {
    e.preventDefault();
    // fetch("/api/chat", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     senderId: currentUserId,
    //     receiverId: otherUserId,
    //     text: data.message
    //   })
    // });
    // chatForm.reset();
    console.log(data);
  }

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
              key={msg.id}
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
