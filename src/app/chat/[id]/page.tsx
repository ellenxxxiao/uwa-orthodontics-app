"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useParams
import { zodResolver } from "@hookform/resolvers/zod";
import { Message, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { LuBell, LuChevronLeft, LuSend } from "react-icons/lu";
import { z } from "zod";

import Header from "../../components/Header";
import MessageBubble from "../../components/MessageBubble";

const schema = z.object({
  message: z.string().trim().min(1)
});

export default function Chat() {
  const router = useRouter();
  const params = useParams(); // Use useParams to get dynamic route parameters
  const routeId = params.id; // Extract id from params

  // Fixed user IDs
  const currentUserId = "0d7e9ae9-dcd9-4bc9-8908-1715778cfaf9";
  const allowedReceiverId = "8a35ed21-2acd-4846-acab-3a42fb1aa733";

  const [msgs, setMsgs] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<User | null>(null);

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

  function onSubmit(data: z.infer<typeof schema>) {
    // console.log(data);

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        senderId: currentUserId,
        receiverId: allowedReceiverId,
        text: data.message
      })
    });
    chatForm.reset();
  }

  useEffect(() => {
    if (routeId !== allowedReceiverId) {
      // If the route ID doesn't match, redirect to 404 page or display 404 message
      // Prevent multiple redirects by returning early if the IDs don't match
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/chat");
        if (res.ok) {
          const messages = await res.json();
          setMsgs(messages);
        } else {
          if (process.env.NODE_ENV !== "production") {
            throw new Error("Failed to fetch messages");
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          throw new Error("Error fetching messages");
        }
      }
    };

    const fetchOtherUser = async () => {
      try {
        const resOtherUser = await fetch(`/api/users/${allowedReceiverId}`);
        if (resOtherUser.ok) {
          const otherUserData = await resOtherUser.json();
          setOtherUser(otherUserData);
        } else {
          if (process.env.NODE_ENV !== "production") {
            throw new Error("Failed to fetch other user");
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          throw new Error("Error fetching other user");
        }
      }
    };

    fetchMessages();
    fetchOtherUser();

    // // Set up a timer to poll for new messages
    // const intervalId = setInterval(fetchMessages, 5000);

    // return () => clearInterval(intervalId);
  }, [routeId, router]); // Add dependencies

  const handleBackClick = () => {
    router.push("/chat-list");
  };

  // Ensure that the routeId check does not conditionally alter the execution of hooks
  if (routeId !== allowedReceiverId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <button
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={() => router.push("/chat-list")}
        >
          Go Back to Chat List
        </button>
      </div>
    );
  }

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
          otherUser
            ? `${otherUser.firstName} ${otherUser.lastName}`
            : "Loading..."
        }
        firstName={otherUser?.firstName || ""}
        lastName={otherUser?.lastName || ""}
        avatar=""
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
