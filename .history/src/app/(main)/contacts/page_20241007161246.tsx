"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { MdAdd } from "react-icons/md";

import Header from "@/components/main/Header";
import UserAvatar from "@/components/main/UserAvatar";
import InvitationDialog from "@/components/main/InvitationDialog";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

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

const contactItemStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#FFFFFF", // 调整背景颜色为白色
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // 细化阴影
  padding: "10px 20px", // 调整内边距
  marginBottom: "2px", // 调整间距
  cursor: "pointer"
};

const contactNameStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#333",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "160px"
};

const contactEmailStyle = {
  fontSize: "14px",
  color: "#666"
};

export default function ContactsPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [filter, setFilter] = useState("all");
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }
  }, [isLoaded, isSignedIn, router]);

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleSendInvitation = (email) => {
    console.log("Sending invitation to", email); // 逻辑处理发送邀请
    setShowDialog(false);
  };

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
            <MdAdd
              size={30}
              strokeWidth={1.3}
              className="text-primary"
              onClick={handleOpenDialog}
            />
          }
          nodeTitle={<span>Contacts</span>}
        />
        <InvitationDialog
          isOpen={showDialog}
          onClose={handleCloseDialog}
          onSend={handleSendInvitation}
        />

        <div className="flex w-full flex-1 flex-col overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto p-4">
            {filteredContacts.map((contact) => (
              <div
                role="button"
                tabIndex={0}
                key={contact.id}
                style={contactItemStyle}
                onClick={() => handleContactClick(contact.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleContactClick(contact.id);
                  }
                }}
              >
                <div className="mr-4">
                  <UserAvatar
                    fullName={`${contact.firstName} ${contact.lastName}`}
                    size={42} // 调整头像大小
                    borderRadius="50%" // 圆形头像
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 style={contactNameStyle}>
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <span style={contactEmailStyle}>{contact.email}</span>
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
