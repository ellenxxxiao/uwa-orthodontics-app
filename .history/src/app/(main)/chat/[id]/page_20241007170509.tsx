"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Message, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { LuSend } from "react-icons/lu";
import io, { Socket } from "socket.io-client";
import { z } from "zod";

import Header from "@/components/main/Header";
import MessageBubble from "@/components/main/MessageBubble";
import UserAvatar from "@/components/main/UserAvatar";
import { Textarea } from "@/components/ui/textarea";

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
  // const socket = new WebSocket(`ws://localhost:3000`);
  // Socket.IO 客户端初始化
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`https://strong-cute-platypus.ngrok-free.app`);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    newSocket.on("new_message", (newMessage) => {
      console.log("Received message:", newMessage);
      setMsgs((prevMsgs) => [...prevMsgs, newMessage]);
    });

    return () => {
      newSocket.close(); // Correct cleanup function
    };
  }, []);

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
    const newMessage = {
      senderId: user!.id,
      receiverId: otherUserId,
      text: data.message,
      id: new Date().getTime(), // 使用时间戳作为临时ID
      sentAt: new Date() // 添加发送时间
    };
    fetch(`/api/chat/${otherUserId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newMessage)
    });
    // Sending the message over Socket.IO if the socket is connected
    if (socket) {
      socket.emit("new_message", newMessage); // Emitting a 'new_message' event with the message data
      console.log("Message sent via Socket.IO:", newMessage);
      setMsgs((prevMsgs) => [...prevMsgs, newMessage]);
    } else {
      console.log("Socket.IO is not connected.");
    }

    chatForm.reset(); // Resetting the form after submission
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

  // // Setup WebSocket connection
  // useEffect(() => {
  //   const socket = new WebSocket(`ws://localhost:3000`);

  //   socket.onopen = () => {
  //     console.log("Connected to WebSocket server");
  //   };

  //   socket.onmessage = (event) => {
  //     // Check if the incoming message is a Blob
  //     if (event.data instanceof Blob) {
  //       // Create a new FileReader to handle the Blob
  //       const reader = new FileReader();

  //       // Once the Blob has been read, parse it as JSON
  //       reader.onload = () => {
  //         console.log(reader.result);
  //         const newMessage = JSON.parse(reader.result);
  //         setMsgs((prevMsgs) => [...prevMsgs, newMessage]);
  //       };

  //       // Read the Blob as text
  //       reader.readAsText(event.data);
  //     } else {
  //       // Handle normal string JSON data
  //       console.log(event.data);
  //       const newMessage = JSON.parse(event.data);
  //       setMsgs((prevMsgs) => [...prevMsgs, newMessage]);
  //     }
  //   };

  //   socket.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   socket.onclose = () => {
  //     console.log("WebSocket connection closed");
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  const handleBackClick = () => {
    router.push("/chat-list");
  };

  return (
    isLoaded && (
      <div className="flex h-full flex-col">
        {/* Header */}
        <Header
          nodeTitle={
            <div className="flex flex-row items-center gap-2">
              <UserAvatar
                size={50}
                fullName={`${otherUser?.firstName} ${otherUser?.lastName}`}
              />
              <span className="text-xl">{`${otherUser?.firstName} ${otherUser?.lastName}`}</span>
            </div>
          }
        />

        {/* Messages */}
        <div className="w-full flex-1 overflow-y-auto bg-white">
          <div className="mx-4 my-6 flex flex-col gap-6 text-app-black">
            {msgs.map((msg) => {
              // 确保msg及其关键属性不为空
              if (!msg || !msg.id || !msg.text || !msg.sentAt) {
                console.log("Skipping message due to incomplete data:", msg);
                return null; // 如果消息数据不完整，跳过渲染该消息
              }
              return (
                <MessageBubble
                  key={msg.id.toString()} // 由于前面的检查，这里可以安全地调用toString
                  text={msg.text}
                  isSender={msg.senderId === user!.id}
                  time={msg.sentAt}
                  showTime={true}
                />
              );
            })}
          </div>
          <ScrollToBottom />
        </div>

        {/* Input */}
        <form
          onSubmit={chatForm.handleSubmit(onSubmit)}
          className="flex h-20 w-full justify-between gap-8 bg-app-white px-4 py-4"
        >
          <div className="relative h-full w-full flex-1 ">
            <div className="h-full w-5/6 rounded-lg bg-[#F0F0F0] text-accent-focus md:w-11/12">
              <Textarea
                style={{ resize: "none", height: "50px" }}
                className="w-full border-none bg-transparent px-3 py-2 text-base focus:outline-none focus-visible:ring-0"
                placeholder="Type a message..."
                {...chatForm.register("message")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    chatForm.handleSubmit(onSubmit)();
                  }
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!chatForm.formState.isValid}
              // FIXME: visibility?
              className={`${chatForm.formState.isValid ? "" : ""} absolute right-0  top-1/2 h-5/6 w-12 -translate-y-1/2 transform rounded-full md:right-4`}
            >
              <LuSend className="mx-auto text-3xl text-primary" />
            </button>
          </div>
        </form>
      </div>
    )
  );
}
