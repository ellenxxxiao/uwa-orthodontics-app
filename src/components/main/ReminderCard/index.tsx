import { RepeatType } from "@prisma/client";
import { TbCalendarRepeat } from "react-icons/tb";

import type { ReminderItem } from "@/types/reminder";

import UserAvatar from "../UserAvatar";

type Props = {
  reminder: ReminderItem;
  onClick: () => void;
};

// Define full Tailwind class names
const colorMap = {
  ALIGNER: "border-app-green bg-app-green",
  APPOINTMENT: "border-app-orange bg-app-orange",
  OTHER: "border-gray-500 bg-gray-500"
};

const abbreviationMap = {
  ALIGNER: "ALGN",
  APPOINTMENT: "APPT",
  OTHER: "OTHR"
};
export default function ReminderCard({ reminder, onClick }: Props) {
  // Use fallback color classes if the reminder type is not recognized
  const classes = colorMap[reminder.reminderType];

  // Determine whether to use the abbreviation or full type

  return (
    <div
      role="button"
      tabIndex={0}
      className={`shadow-standard relative flex h-20 cursor-pointer flex-row items-center rounded-r-lg border-l-8 bg-white p-3 ${classes.split(" ")[0]}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="mr-4">
        <UserAvatar fullName={reminder.patientName} size={48} />
      </div>
      <div className="flex-1 overflow-hidden ">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-black">
            {reminder.patientName}
          </h3>
          <div className="flex items-center justify-center gap-2">
            {reminder.repeat !== RepeatType.NEVER && (
              <TbCalendarRepeat className="text-2xl text-accent-focus" />
            )}
            <span
              className={`flex items-center justify-center rounded-2xl p-2 font-mono text-base font-bold leading-none ${classes.split(" ")[1]} text-white`}
            >
              <span className="block sm:hidden">
                {abbreviationMap[reminder.reminderType] ||
                  reminder.reminderType}
              </span>
              <span className="hidden sm:block">{reminder.reminderType}</span>
            </span>
          </div>
        </div>
        {/* <p className="text-gray-600">
          {reminder.startDate + " to " + reminder.endDate}
        </p> */}
        <p className="truncate text-gray-600">{reminder.description}</p>
      </div>
    </div>
  );
}
