import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 确保组件已挂载且router对象已可用
    if (!router.isReady) return;

    const userId = router.query.id;
    async function fetchContacts() {
      try {
        const response = await fetch(`/api/contacts/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        const data = await response.json();
        setContacts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Fetching contacts failed:", error);
        setIsLoading(false);
      }
    }

    fetchContacts();
  }, [router.isReady, router.query.id]); // 添加 router.isReady 作为依赖

  const filteredContacts = contacts.filter((contact) =>
    `${contact.firstName} ${contact.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isLoading ? (
        <p>Loading contacts...</p>
      ) : (
        <ul>
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <li key={contact.id}>
                {contact.firstName} {contact.lastName}
              </li>
            ))
          ) : (
            <p>No contacts found.</p>
          )}
        </ul>
      )}
    </div>
  );
}
