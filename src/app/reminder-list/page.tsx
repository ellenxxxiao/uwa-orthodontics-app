"use client";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ReminderCard from "../components/reminderCard/reminderCard";
import SearchInput from "../components/searchInput/searchInput";
import { IconButton } from "@mui/material";

export default function Home() {
  return (
    <>
      <div className="flex h-screen flex-col">
        {/* main */}
        <Header type={"primary"} iconLeft={<IconButton aria-label="back" className="bg-base-100">
          <ChevronLeftIcon />
        </IconButton>} iconRight={
          <IconButton aria-label="back" className="bg-base-100">
            <AddIcon
              fontSize="large"
              onClick={() => { alert('hello') }}
              sx={{ padding: 1 }} // Apply spacing using theme.spacing()
            /> </IconButton>} />

        <div className="w-full flex-1 overflow-y-auto bg-base-100">
          REMINDER MAIN +++
          <div className="  flex flex-col px-2 py-2 gap-4 ">
            <SearchInput />
            <div className="flex flex-col gap-[10px]">
              <ReminderCard />
              <ReminderCard />
              <ReminderCard />
              <ReminderCard />
              <ReminderCard />
            </div>

          </div>
        </div>

        {/* footer */}
        <Footer />
      </div>
    </>
  );
}

