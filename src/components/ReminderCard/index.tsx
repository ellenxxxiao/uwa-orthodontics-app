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

export default function ReminderCard({ reminder, onClick }: Props) {
  // Use fallback color classes if the reminder type is not recognized
  const classes = colorMap[reminder.reminderType];

  return (
    <div
      className={`relative flex cursor-pointer flex-row items-center rounded-r-lg border-l-8 bg-white p-3 ${classes.split(" ")[0]}`}
      onClick={onClick}
    >
      <div className="mr-4">
        <UserAvatar fullName={reminder.patientName} size={70} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-black">
            {reminder.patientName}
          </h3>
          <span
            className={`flex items-center justify-center rounded-2xl p-2 font-mono text-base font-bold leading-none ${classes.split(" ")[1]} text-white`}
          >
            {reminder.reminderType}
          </span>
        </div>
        <p className="text-gray-600">
          {reminder.startDate + " to " + reminder.endDate}
        </p>
        <p className="text-gray-600">{reminder.description}</p>
      </div>
    </div>
  );
}
