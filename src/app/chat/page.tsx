"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Message, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { LuBell, LuChevronLeft, LuSend } from "react-icons/lu";
import { z } from "zod";

import { IDs } from "../api/chat/route";
import Header from "../components/Header";
import MessageBubble from "../components/MessageBubble";

const schema = z.object({
  message: z.string().trim().min(1)
});

export default function Home() {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const currentUserId = IDs.senderId;
  const otherUserId = IDs.receiverId;
  // const [user, setUser] = useState({} as User);
  const [otherUser, setOtherUser] = useState({} as User);
  const router = useRouter();
  // const [isMounted, setIsMounted] = useState(true); // control request

  const ScrollToBottom = () => {
    const elementRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      if (elementRef.current) {
        elementRef.current.scrollIntoView();
      }
    });
    return <div ref={elementRef} />;
  };

  const chatForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { message: "" },
    mode: "onChange"
  });

  const fetchMessages = async () => {
    const res = await fetch("/api/chat");
    const messages = await res.json();
    setMsgs(messages);
  };

  function onSubmit(data: z.infer<typeof schema>) {
    // console.log(data);

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        senderId: currentUserId,
        receiverId: otherUserId,
        text: data.message
      })
    });
    chatForm.reset();
  }

  const fetchUsers = async () => {
    // const resUser = await fetch(`/api/users/${currentUserId}`);
    // const user = await resUser.json();

    const resOtherUser = await fetch(`/api/users/${otherUserId}`);
    const otherUser = await resOtherUser.json();
    // setUser(user);
    setOtherUser(otherUser);
  };

  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, []);

  // useEffect(() => {
  //   setIsMounted(true);
  //   fetchMessages();
  //   fetchUsers();
  //   return () => setIsMounted(false);
  // }, []); // control request

  // FIXME: Polling. Not the best way to do it, but it works for now.
  // useEffect(() => {
  //   fetchMessages();
  //   const intervalId = setInterval(fetchMessages, 500);

  //   return () => clearInterval(intervalId);
  // }, [isMounted]);

  const handleBackClick = () => {
    // setIsMounted(false); // shut dowm when leave
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
        avatar=""
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
        <ScrollToBottom />
      </div>

      {/* Input */}
      <form
        onSubmit={chatForm.handleSubmit(onSubmit)}
        className="flex h-20 w-full justify-between gap-8 bg-app-white px-3 py-4"
      >
        <div className="relative h-full w-full flex-1 rounded-full border border-base-200  text-accent-focus">
          <textarea
            className="h-full w-5/6 bg-transparent px-3 py-2 text-base focus:outline-none"
            placeholder="Type a message..."
            {...chatForm.register("message")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                chatForm.handleSubmit(onSubmit)();
              }
            }}
          />

          <button
            type="submit"
            disabled={!chatForm.formState.isValid}
            className={`${chatForm.formState.isValid ? "" : ""} absolute right-1 top-1/2 h-5/6 w-12 -translate-y-1/2 transform rounded-full bg-primary`}
          >
            <LuSend className="mx-auto text-xl text-app-white" />
          </button>
        </div>
      </form>
    </div>
  );
}
