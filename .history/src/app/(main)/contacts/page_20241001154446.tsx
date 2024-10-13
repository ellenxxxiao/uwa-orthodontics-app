"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    firstName: "Alian",
    lastName: "Haidar",
    email: "alian@example.com"
  },
  {
    id: "2",
    firstName: "Ellen",
    lastName: "Xiao",
    email: "ellen@example.com"
  },
  {
    id: "3",
    firstName: "Eric",
    lastName: "Xiao",
    email: "eric@example.com"
  },
  {
    id: "4",
    firstName: "Neha",
    lastName: "",
    email: "neha@example.com"
  },
  {
    id: "5",
    firstName: "Runtian",
    lastName: "Liang",
    email: "runtian@example.com"
  },
  {
    id: "6",
    firstName: "Zimu",
    lastName: "Zhang",
    email: "zimu@example.com"
  }
];

function groupContacts(contacts: Contact[]) {
  return contacts.reduce((acc, contact) => {
    const group = contact.lastName[0].toUpperCase();
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(contact);
    return acc;
  }, {});
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const groupedContacts = groupContacts(
    contacts.filter((contact) =>
      `${contact.firstName} ${contact.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const router = useRouter();

  return (
    <>
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

      <div className="container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {Object.keys(groupedContacts)
          .sort()
          .map((group) => (
            <div key={group}>
              <h2>{group}</h2>
              <ul>
                {groupedContacts[group].map((contact) => (
                  <li
                    key={contact.id}
                    onClick={() => router.push(`/contact/${contact.id}`)}
                  >
                    <UserAvatar
                      fullName={`${contact.firstName} ${contact.lastName}`}
                      size={48}
                      borderRadius="24px"
                    />
                    {contact.firstName} {contact.lastName}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </>
  );
}
