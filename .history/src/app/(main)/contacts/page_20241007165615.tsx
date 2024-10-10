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
}

// const mockContacts: Contact[] = [
//   {
//     id: "1",
//     firstName: "Alian",
//     lastName: "Haidar",
//   },
//   {
//     id: "2",
//     firstName: "Ellen",
//     lastName: "Xiao",
//   },
//   {
//     id: "3",
//     firstName: "Eric",
//     lastName: "Xiao",
//   },
//   {
//     id: "4",
//     firstName: "Runtian",
//     lastName: "Liang",
//   },
//   {
//     id: "5",
//     firstName: "Zimu",
//     lastName: "Zhang",
//   },
// ];

const contactItemStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  padding: "10px 20px",
  marginBottom: "2px",
  cursor: "pointer"
};

const contactNameStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#333",
  marginLeft: "10px"
};

const contactEmailStyle = {
  fontSize: "14px",
  color: "#666",
  marginLeft: "10px"
};

const sectionHeaderStyle = {
  fontWeight: "bold",
  fontSize: "18px",
  color: "#444",
  padding: "10px 20px",
  backgroundColor: "#f5f5f5"
};

const alphabetStyle = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  padding: "5px",
  fontSize: "12px", // Smaller font size
  lineHeight: "20px", // Reduced line height for compact appearance
  color: "#666",
  cursor: "pointer"
};

export default function ContactsPage() {
  const { isSignedIn, user } = useUser();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    fetchContacts();
  }, [isSignedIn, user]);

  async function fetchContacts() {
    const response = await fetch(`/api/contacts/${user.id}`);
    if (!response.ok) {
      console.error("Failed to fetch contacts:", response.statusText);
      return;
    }
    const contactsData = await response.json();
    setContacts(contactsData);
  }

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleSendInvitation = (email) => {
    console.log("Sending invitation to", email);
    setShowDialog(false);
  };

  const groupedContacts = contacts.reduce((acc, contact) => {
    const firstLetter = contact.firstName.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(contact);
    return acc;
  }, {});

  const handleContactClick = (contactId: string) => {
    router.push(`/chat/${contactId}`);
  };

  return (
    <>
      <div className="relative flex h-full flex-col">
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
            {Object.entries(groupedContacts).map(([letter, contacts]) => (
              <>
                <div key={letter} style={sectionHeaderStyle}>
                  {letter}
                </div>
                {contacts.map((contact) => (
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
                        size={42}
                        borderRadius="50%"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 style={contactNameStyle}>
                          {contact.firstName} {contact.lastName}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ))}
          </div>
          <div style={alphabetStyle}>
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
              <div key={letter}>{letter}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
