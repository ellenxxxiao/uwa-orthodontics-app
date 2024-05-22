"use client";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ReminderCard from "../components/reminderCard/reminderCard";
import SearchInput from "../components/searchInput/searchInput";
import { Button, Card, IconButton } from "@mui/material";
import { useState } from "react";
import AddReminer from "../components/addReminder/addReminder";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [showAddButton, setshowAddButton] = useState(false);
  const [showHeader, setshowHeader] = useState("");

  const handleAddButtonClick = () => {
    setShowForm(true);
    setshowAddButton(true);
    setshowHeader("Add Reminder");
  };
  const handleBackButtonClick = () => {
    setShowForm(false);
    setshowAddButton(false);
    setshowHeader("");
  };

  return (
    <>
      <div className="flex h-screen flex-col">
        {/* main */}
        <Header
          title={showHeader}
          type={"primary"}
          iconLeft={
            <IconButton aria-label="back" className="bg-base-100">
              <ChevronLeftIcon
                fontSize="large"
                sx={{ padding: 1 }}
                onClick={handleBackButtonClick}
              />
            </IconButton>
          }
          iconRight={
            showAddButton ? (
              <Button >Add</Button>
            ) : (
              <IconButton aria-label="back" className="bg-base-100">
                <AddIcon
                  fontSize="large"
                  onClick={handleAddButtonClick}
                  sx={{ padding: 1 }}
                />{" "}
              </IconButton>
            )
          }
        />

        <div className="w-full flex-1 overflow-y-auto bg-base-100">
          {showForm ? (
            <div className="  flex flex-col gap-4 px-6 py-2">
              <AddReminer />
            </div>
          ) : (
            <>
              <div className="  flex flex-col gap-4 px-6 py-2">
                <SearchInput />
                <div className="flex flex-col gap-[10px]">
                  <ReminderCard />
                  <ReminderCard />
                  <ReminderCard />
                  <ReminderCard />
                  <ReminderCard />
                </div>
              </div>
            </>
          )}
        </div>

        {/* footer */}
        <Footer />
      </div>
    </>
  );
}
