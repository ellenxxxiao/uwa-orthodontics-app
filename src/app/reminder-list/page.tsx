"use client";

import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { LuPlusCircle, LuSearch, LuStepBack, LuSave } from "react-icons/lu";
import { Button, Card, IconButton } from "@mui/material";
import { useState, ChangeEvent } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import AddReminder from "../components/addReminder/addReminder";

import Header from "../components/Header";
import Footer from "../components/Footer";

enum RepeatPeriod {
  Weekly, Monthly, Yearly, Custom
}

interface Reminder {
  reminderName: string;
  reminderID: number;
  notesToClinician: string;
  patientName: string; // TODO: change to patientID when we decide how to do patientID
  repeatPeriod: RepeatPeriod;
  startDate: string; // TODO: change to a real date type
  endDate: string;   // TODO: change to a real date type
  timeOfDay: string; // TODO: change to a real time type
  messageToPatient: string;
}

export default function ReminderList() {
  const emptyReminder: Reminder =
    { reminderName: 'New Reminder',
      reminderID: 0,
      notesToClinician: 'Notes to yourself',
      patientName: 'Put Patient\'s name here',
      repeatPeriod: RepeatPeriod.Weekly,
      startDate: 'put starting date here',
      endDate: 'put end date here',
      timeOfDay: 'when in the day to send this reminder',
      messageToPatient: 'message to display to patient when they receive this reminder'
    };

  const reminders: Reminder[] = [
    { reminderName: 'Test reminder 1',
      reminderID: 123,
      notesToClinician: 'this is test reminder #1',
      patientName: 'Zimu Zhang',
      repeatPeriod: RepeatPeriod.Weekly,
      startDate: '2020-02-02',
      endDate: '2024-01-17',
      timeOfDay: '9:00AM',
      messageToPatient: 'this is a hard-coded message for reminder #1'},
    { reminderName: 'Test reminder 2',
      reminderID: 456,
      notesToClinician: 'this is test reminder #2',
      patientName: 'Alian Haidar',
      repeatPeriod: RepeatPeriod.Monthly,
      startDate: '1999-09-09',
      endDate: '2000-01-01',
      timeOfDay: '10:45PM',
      messageToPatient: 'this is a hard-coded message for reminder #2'}
  ];

  const [editing, setEditing] = useState<boolean>(false)

  const handleReminderCardClick = (i:number) => {
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

  const handleEdit = (event: ChangeEvent<HTMLInputElement>, newReminder: Reminder) => {
    const index = reminders.findIndex(item => item.reminderID === newReminder.reminderID);
    if (index === -1) {
      reminders.push(newReminder);
    } else {
      reminders[index] = newReminder;
    }
  };

  return (
    <>
    { editing ? (
      <div className="flex h-screen flex-col">
      <Header
          title="Edit Reminder"
          type="primary"
          iconLeft={
            <IconButton aria-label="back" className="bg-base-100">
              <LuStepBack className="text-primary" size={30} strokeWidth={1.3} onClick={handleCancelClick}/>
            </IconButton>
          }
          iconRight={
              <IconButton aria-label="back" className="bg-base-100">
                <LuSave className="text-primary" size={30} strokeWidth={1.3} onClick={handleSaveClick}/>
              </IconButton>
          }/>
        <AddReminder />
      <Footer />
      </div>
    ) : (
      <div className="flex h-screen flex-col">
        <Header
          type="primary"
          iconLeft={<LuSearch size={30} strokeWidth={1.3} className="text-primary"/>}
          iconRight={<LuPlusCircle size={30} strokeWidth={1.3} className="text-primary" onClick={handleAddNewButton}/>}
          title="Reminders"/>
        <div className="w-full flex-1 flex flex-col overflow-hidden bg-base-100">

        {/* main */}
        <div className="flex-1 overflow-y-auto p-4">
          {(() => {
            const reminderCards = [];
            for (let i = 0; i < reminders.length; i++) {
              reminderCards.push(
                <div className="flex items-center mb-4 p-4 bg-white rounded-lg shadow relative cursor-pointer" onClick={()=>handleReminderCardClick(i)} onKeyDown={()=>handleReminderCardClick(i)}>
                  <div className="absolute left-6 w-1 h-16 bg-blue-500"></div>
                  <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 ml-4 relative">
                    <img src="/path/to/user/image" alt="User" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg text-black">{reminders[i].patientName}</h3>
                      <span className="py-2 px-4 rounded-full bg-blue-500 text-sm">{"ALGINERS"}</span>
                    </div>
                    <p className="text-gray-600">{reminders[i].startDate + " to " + reminders[i].endDate + ",  " + reminders[i].timeOfDay + ",  " + reminders[i].repeatPeriod}</p>
                    <p className="text-gray-600">{reminders[i].messageToPatient}</p>
                  </div>
                </div>);}
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
