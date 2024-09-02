"use client";

import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { LuPlusCircle, LuSearch, LuStepBack, LuSave } from "react-icons/lu";
import { Button, Card, IconButton } from "@mui/material";
import { useState, ChangeEvent } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import AddReminder from "../components/addReminder/addReminder";

<<<<<<< HEAD
import Header from "../components/Header";
import Footer from "../components/Footer";
=======
import AddReminer from "@/components/addReminder";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ReminderCard from "@/components/reminderCard";
import SearchInput from "@/components/searchInput";
>>>>>>> origin/main

enum RepeatPeriod {
  Weekly,
  Monthly,
  Yearly,
  Custom
}

interface Reminder {
  reminderName: string;
  reminderID: number;
  notesToClinician: string;
  patientName: string; // TODO: change to patientID when we decide how to do patientID
  repeatPeriod: RepeatPeriod;
  startDate: string; // TODO: change to a real date type
  endDate: string; // TODO: change to a real date type
  timeOfDay: string; // TODO: change to a real time type
  messageToPatient: string;
}

export default function ReminderList() {
  const emptyReminder: Reminder = {
    reminderName: "New Reminder",
    reminderID: 0,
    notesToClinician: "Notes to yourself",
    patientName: "Put Patient's name here",
    repeatPeriod: RepeatPeriod.Weekly,
    startDate: "put starting date here",
    endDate: "put end date here",
    timeOfDay: "when in the day to send this reminder",
    messageToPatient:
      "message to display to patient when they receive this reminder"
  };

  const reminders: Reminder[] = [
    {
      reminderName: "Test reminder 1",
      reminderID: 123,
      notesToClinician: "this is test reminder #1",
      patientName: "Zimu Zhang",
      repeatPeriod: RepeatPeriod.Weekly,
      startDate: "2020-02-02",
      endDate: "2024-01-17",
      timeOfDay: "9:00AM",
      messageToPatient: "this is a hard-coded message for reminder #1"
    },
    {
      reminderName: "Test reminder 2",
      reminderID: 456,
      notesToClinician: "this is test reminder #2",
      patientName: "Alian Haidar",
      repeatPeriod: RepeatPeriod.Monthly,
      startDate: "1999-09-09",
      endDate: "2000-01-01",
      timeOfDay: "10:45PM",
      messageToPatient: "this is a hard-coded message for reminder #2"
    }
  ];

  const [editing, setEditing] = useState<boolean>(false);

  const handleReminderCardClick = (i: number) => {
    setEditing(true);
  };

  const handleAddNewButton = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    setEditing(false);
  };

  const handleCancelClick = () => {
    setEditing(false);
  };

  const handleEdit = (
    event: ChangeEvent<HTMLInputElement>,
    newReminder: Reminder
  ) => {
    const index = reminders.findIndex(
      (item) => item.reminderID === newReminder.reminderID
    );
    if (index === -1) {
      reminders.push(newReminder);
    } else {
      reminders[index] = newReminder;
    }
  };

  return (
    <>
      {editing ? (
        <div className="flex h-screen flex-col">
          <Header
            title="Edit Reminder"
            type="primary"
            iconLeft={
              <IconButton aria-label="back" className="bg-base-100">
                <LuStepBack
                  className="text-primary"
                  size={30}
                  strokeWidth={1.3}
                  onClick={handleCancelClick}
                />
              </IconButton>
            }
            iconRight={
              <IconButton aria-label="back" className="bg-base-100">
                <LuSave
                  className="text-primary"
                  size={30}
                  strokeWidth={1.3}
                  onClick={handleSaveClick}
                />
              </IconButton>
            }
          />
          <AddReminder />
          <Footer />
        </div>
      ) : (
        <div className="flex h-screen flex-col">
          <Header
            type="primary"
            iconLeft={
              <LuSearch size={30} strokeWidth={1.3} className="text-primary" />
            }
            iconRight={
              <LuPlusCircle
                size={30}
                strokeWidth={1.3}
                className="text-primary"
                onClick={handleAddNewButton}
              />
            }
            title="Reminders"
          />
          <div className="flex w-full flex-1 flex-col overflow-hidden bg-base-100">
            {/* main */}
            <div className="flex-1 overflow-y-auto p-4">
              {(() => {
                const reminderCards = [];
                for (let i = 0; i < reminders.length; i++) {
                  reminderCards.push(
                    <div
                      className="relative mb-4 flex cursor-pointer items-center rounded-lg bg-white p-4 shadow"
                      onClick={() => handleReminderCardClick(i)}
                      onKeyDown={() => handleReminderCardClick(i)}
                    >
                      <div className="absolute left-6 h-16 w-1 bg-blue-500"></div>
                      <div className="relative ml-4 mr-4 h-16 w-16 rounded-full bg-gray-200">
                        <img
                          src="/path/to/user/image"
                          alt="User"
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-black">
                            {reminders[i].patientName}
                          </h3>
                          <span className="rounded-full bg-blue-500 px-4 py-2 text-sm">
                            {"ALGINERS"}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          {reminders[i].startDate +
                            " to " +
                            reminders[i].endDate +
                            ",  " +
                            reminders[i].timeOfDay +
                            ",  " +
                            reminders[i].repeatPeriod}
                        </p>
                        <p className="text-gray-600">
                          {reminders[i].messageToPatient}
                        </p>
                      </div>
                    </div>
                  );
                }
                return reminderCards;
              })()}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}
