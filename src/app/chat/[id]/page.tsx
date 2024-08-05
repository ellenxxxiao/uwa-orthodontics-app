"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useParams
import { Message, User } from "@prisma/client";
import { LuBell, LuChevronLeft, LuSendHorizonal } from "react-icons/lu";

import Header from "../../components/Header";
import Input from "../../components/Input";
import MessageBubble from "../../components/MessageBubble";

export default function Chat() {
  const router = useRouter();
  const params = useParams(); // Use useParams to get dynamic route parameters
  const routeId = params.id; // Extract id from params

  // Fixed user IDs
  const currentUserId = "0d7e9ae9-dcd9-4bc9-8908-1715778cfaf9";
  const allowedReceiverId = "8a35ed21-2acd-4846-acab-3a42fb1aa733";

  const [msgs, setMsgs] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<User | null>(null);

  useEffect(() => {
    if (routeId !== allowedReceiverId) {
      // If the route ID doesn't match, redirect to 404 page or display 404 message
      // Prevent multiple redirects by returning early if the IDs don't match
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat?userId=${currentUserId}&otherUserId=${allowedReceiverId}`);
        if (res.ok) {
          const messages = await res.json();
          setMsgs(messages);
        } else {
          if (process.env.NODE_ENV !== 'production') {
            throw new Error("Failed to fetch messages");
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
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
          if (process.env.NODE_ENV !== 'production') {
            throw new Error("Failed to fetch other user");
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error("Error fetching other user");
        }
      }
    };

    fetchMessages();
    fetchOtherUser();

    // Set up a timer to poll for new messages
    const intervalId = setInterval(fetchMessages, 5000);

    return () => clearInterval(intervalId);
  }, [routeId, router]); // Add dependencies

  const handleBackClick = () => {
    router.push("/chat-list");
  };

  // Ensure that the routeId check does not conditionally alter the execution of hooks
  if (routeId !== allowedReceiverId) {
    return (
      <div className="flex h-screen flex-col justify-center items-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
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
          otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Loading..."
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
