"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Message, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { LuBell, LuChevronLeft, LuSend } from "react-icons/lu";
import { z } from "zod";

import Header from "@/components/Header";
import MessageBubble from "@/components/MessageBubble";

const schema = z.object({
  message: z.string().trim().min(1)
});

export default function Chat() {
  const { isSignedIn, user, isLoaded } = useUser();

  const router = useRouter();
  const params = useParams(); // Use useParams to get dynamic route parameters
  const [msgs, setMsgs] = useState<Message[]>([]);
  const otherUserId = params.id; // Extract id from params
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [wsPort, setWsPort] = useState(null);

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
    fetch("/api/chat/${otherUserId}", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        senderId: user!.id,
        receiverId: otherUserId,
        text: data.message
      })
    });
    chatForm.reset();
  }

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/${otherUserId}`);
        if (res.ok) {
          const data = await res.json();
          setMsgs(data.messages);
          setWsPort(data.wsPort);
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
        const resOtherUser = await fetch(`/api/users/${otherUserId}`);
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

    isLoaded && fetchMessages();
    isLoaded && fetchOtherUser();
  }, [isLoaded, isSignedIn, otherUserId, router]); // Add dependencies

  // Setup WebSocket connection
  useEffect(() => {
    if (wsPort) {
      const socket = new WebSocket(`ws://localhost:${wsPort}`);

      socket.onopen = () => {
        console.log("Connected to WebSocket server");
      };

      socket.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        setMsgs((prevMsgs) => [...prevMsgs, newMessage]);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return () => {
        socket.close();
      };
    }
  }, [wsPort]);

  const handleBackClick = () => {
    router.push("/chat-list");
  };

  return (
    isLoaded && (
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
                isSender={msg.senderId === user!.id}
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
              // FIXME: visibility?
              className={`${chatForm.formState.isValid ? "" : ""} absolute right-1 top-1/2 h-5/6 w-12 -translate-y-1/2 transform rounded-full bg-primary`}
            >
              <LuSend className="mx-auto text-xl text-app-white" />
            </button>
          </div>
        </form>
      </div>
    )
  );
}
