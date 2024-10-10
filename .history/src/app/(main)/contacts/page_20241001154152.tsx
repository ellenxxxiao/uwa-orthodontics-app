"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LuPenSquare } from "react-icons/lu";

import Header from "@/components/main/Header";
import UserAvatar from "@/components/main/UserAvatar";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string; // 假设联系人信息中包含电子邮件
}

// 虚拟的联系人数据
const mockContacts: Contact[] = [
  {
    id: "1",
    firstName: "张",
    lastName: "三",
    email: "zhangsan@example.com"
  },
  {
    id: "2",
    firstName: "李",
    lastName: "四",
    email: "lisi@example.com"
  },
  {
    id: "3",
    firstName: "王",
    lastName: "五",
    email: "wangwu@example.com"
  }
];

export default function ContactsPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [contacts, setContacts] = useState<Contact[]>(mockContacts); // 使用虚拟数据初始化状态
  const [filter, setFilter] = useState("all");

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }
  }, [isLoaded, isSignedIn, router]);

  const filteredContacts = contacts.filter((contact) => {
    if (filter === "all") return true;
    // 这里可以添加更多筛选逻辑
    return contact;
  });

  const handleContactClick = (contactId: string) => {
    router.push(`/contact/${contactId}`);
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <Header
          nodeRight={
            <LuPenSquare
              size={30}
              strokeWidth={1.3}
              className="text-primary"
              onClick={() => router.push("/new-contact")}
            />
          }
          nodeTitle={<span>Contacts</span>}
        />

        {/* Main content */}
        <div className="flex w-full flex-1 flex-col overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto p-4">
            {filteredContacts.map((contact) => (
              <div
                role="button"
                tabIndex={0}
                key={contact.id}
                className="relative mb-4 flex cursor-pointer items-center rounded-lg bg-white p-2 shadow-standard"
                onClick={() => handleContactClick(contact.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleContactClick(contact.id);
                  }
                }}
              >
                {/* Avatar box */}
                <div className="mr-4">
                  <UserAvatar
                    fullName={`${contact.firstName} ${contact.lastName}`}
                    size={48}
                    borderRadius="2.5rem"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className="w-32 truncate text-lg font-bold text-black" // Limit name length
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "8rem"
                      }}
                    >
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {contact.email}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
