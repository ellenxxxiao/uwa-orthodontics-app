"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk hook to get the logged-in user
import { LuPlusCircle } from "react-icons/lu";
import EditReminderModal from "@/components/main/EditReminderModal";
import Header from "@/components/main/Header";
import ReminderCard from "@/components/main/ReminderCard";
import type { ReminderItem } from "@/types/reminder";

export default function ReminderList() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<ReminderItem | null>(
    null
  );
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser(); // Get the current logged-in user

  // Print the user object to the console for debugging purposes
  useEffect(() => {
    if (user) {
      console.log("Logged-in user:", user);
    }
  }, [user]);

  // Fetch reminders for the logged-in user via the API
  useEffect(() => {
    const fetchReminders = async () => {
      if (!user) return; // Wait until the user is loaded

      try {
        const response = await fetch(`/api/reminder/1`); // Fetch reminders, 1 is just set, as API already has the user ID
        if (!response.ok) {
          throw new Error("Failed to fetch reminders");
        }
        const data = await response.json();
        setReminders(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, [user]);

  const handleCardClick = (reminder: ReminderItem) => {
    setSelectedReminder(reminder);
    setIsOpen(true);
  };

  return (
    <div className="flex h-full flex-col">
      <EditReminderModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        reminder={selectedReminder}
      />
      <Header
        nodeRight={
          <button
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <LuPlusCircle
              size={30}
              strokeWidth={1.3}
              className="text-primary"
            />
          </button>
        }
        nodeTitle={<span>Reminders</span>}
      />
      <div className="flex flex-1 flex-col bg-app-white">
        <div className="flex flex-col gap-4 p-4">
          {loading ? (
            <p>Loading reminders...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : reminders.length === 0 ? (
            <p>No reminders found</p>
          ) : (
            reminders.map((reminder) => (
              <ReminderCard
                key={reminder.reminderId}
                reminder={reminder}
                onClick={() => handleCardClick(reminder)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
