import React from "react";
import { FiMessageCircle, FiBell, FiSettings } from "react-icons/fi";
import { LuAlarmClock } from "react-icons/lu";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2A8BF2] py-4 w-[100%] ">
      <div className="flex flex-row justify-around">
        <FiMessageCircle className="text-white text-2xl cursor-pointer" />
        <LuAlarmClock className="text-white text-2xl cursor-pointer" />
        <FiSettings className="text-white text-2xl cursor-pointer" />
      </div>
    </footer>
  );
};

export default Footer;
