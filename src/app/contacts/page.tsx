"use client";

import { useState, useEffect } from "react";
import { Message } from "@prisma/client";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Link from 'next/link'


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

  const [inputMessage, setInputMessage] = useState('');

  const handleMessageSend = () => {
    console.log(inputMessage); 
    setInputMessage('');
  };

  // const handleMessageSend = async () => {
  //   if (!inputMessage.trim()) return; 
  
  //   const messageData = {
  //     text: inputMessage,
  //     senderId: currentUserId,  // 假设你有当前用户的ID
  //     // 其他可能需要的信息，比如 receiverId
  //   };
  
  //   try {
  //     const res = await fetch("/api/chat", {  // 假设 "/api/chat" 是你的后端接口
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(messageData),
  //     });
  
  //     const newMessage = await res.json();
  
  //     if (res.ok) {
  //       setMsgs(prevMsgs => [...prevMsgs, newMessage]);  // 添加新消息到列表
  //       setInputMessage('');  // 清空输入框
  //     } else {
  //       throw new Error('Failed to send message');
  //     }
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //   }
  // };
  


  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-500 bg-gray-100 fixed top-0 w-full">
        <Link href="/chat">
          <Button className="text-blue-500">
            <ArrowBackIcon />
          </Button>
        </Link>
        <h1 className="text-black font-semibold">Patient 1</h1>
        <div style={{ width: 48 }}></div>  {/* placeholder balance */}
      </div>

      {/* message list */}
      <div className="flex-1 overflow-y-auto p-3 mt-6 pt-16 pb-20 bg-white">
        {msgs.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUserId ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-2/3 rounded-lg p-2 mb-2 shadow ${msg.senderId === currentUserId ? 'bg-blue-100' : 'bg-gray-300'}`}>
              <p className="text-black">{msg.text}</p>
            </div>
            <span className="text-sm text-gray-500 mb-2">{msg.sentAt}</span>
          </div>
        ))}
      </div>

      {/* 输入和发送按钮 */}
      <div className="p-4 flex items-center bg-gray-100 fixed bottom-0 w-full">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-full p-2 mr-4 text-black"
        />
        <Button onClick={handleMessageSend} className="bg-blue-500 text-white p-2 rounded-full">
          <SendIcon />
        </Button>
      </div>
    </div>

    
  );
}
