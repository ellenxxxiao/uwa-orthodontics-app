import type { ReminderItem } from "@/types/reminder";

import UserAvatar from "../UserAvatar";

type Props = {
  reminder: ReminderItem;
};

// Define full Tailwind class names
const colorMap = {
  ALIGNER: "border-app-green bg-app-green",
  APPOINTMENT: "border-app-orange bg-app-orange",
  OTHER: "border-gray-500 bg-gray-500"
};

export default function ReminderCard({ reminder }: Props) {
  // Use fallback color classes if the reminder type is not recognized
  const classes = colorMap[reminder.reminderType];

  return (
    <div
      className={`relative flex cursor-pointer flex-row items-center rounded-r-lg border-l-8 bg-white p-3 ${classes.split(" ")[0]}`}
      // onClick={() => handleReminderCardClick(i)}
      // onKeyDown={() => handleReminderCardClick(i)}
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
            className={`rounded-2xl p-2 text-base font-medium ${classes.split(" ")[1]} text-white`} // Use the background class
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
