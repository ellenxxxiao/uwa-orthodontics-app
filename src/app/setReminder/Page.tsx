"use client";
import React, { useEffect, useState } from "react";
import Layout from "../components/layout/layout";
import ContactCard from "../components/contactCard/contactCard";
import Footer from "../components/footer/footer";
import { Button } from "@mui/material";
import UserCard from "../components/detailsCard/detailsCard";

interface HomePageProps {}

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

const HomePage: React.FC<HomePageProps> = () => {
  const [isContactCardOpen, setIsContactCardOpen] = React.useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data.slice(0, 2)); // Get first 10 users
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleDeleteUser = (id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  const handleNewReminderClick = () => {
    setIsContactCardOpen(true); // Open ContactCard on click
  };

  return (
    <Layout>
      <div>
        <div className="  flex flex-col px-2 py-2 gap-4 ">
          <input
            id="search"
            type="text"
            placeholder="Search..."
            className="w-[100%] mt-4 p-3 border border-gray-300 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            variant="contained"
            className="w-[100%]"
            onClick={handleNewReminderClick}
          >
            <span>+</span> New Reminder
          </Button>

          {/* Conditional rendering of ContactCard */}
          {isContactCardOpen && (
            <ContactCard onClose={() => setIsContactCardOpen(false)} />
          )}

{/* <div className="h-screen overflow-hidden flex justify-center">
          <div className="w-full max-w-md overflow-y-auto">
            <div className="flex flex-col gap-4">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          </div>
        </div> */}
        </div>

      </div>
    </Layout>
  );
};

export default HomePage;
