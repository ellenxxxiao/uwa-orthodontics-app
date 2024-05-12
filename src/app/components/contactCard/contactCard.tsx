import React, { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

interface ContactCardProps {
  onClose: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [repeatReminder, setRepeatReminder] = useState(false);
  const [repeatInterval, setRepeatInterval] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [comment, setComment] = useState("");

  // Generate options for appointment time dropdown with 15-minute intervals
  const appointmentTimeOptions: string[] = [];
  for (let hours = 0; hours < 24; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      const timeString = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      appointmentTimeOptions.push(timeString);
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">New Reminder</h2>
        <div className="mb-4">
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Select
            className="w-full"
            label="Appointment Time"
            variant="outlined"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value as string)}
          >
            {appointmentTimeOptions.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="mb-4">
          <FormControlLabel
            control={
              <Checkbox
                checked={repeatReminder}
                onChange={(e) => setRepeatReminder(e.target.checked)}
              />
            }
            label="Repeat Reminder"
          />
          {repeatReminder && (
            <div className="mt-2">
              <Select
                label="Select"
                className="w-full"
                value={repeatInterval}
                onChange={(e) => setRepeatInterval(e.target.value as string)}
                variant="outlined"
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="early">Yearly</MenuItem>
                <MenuItem value="early">Custom</MenuItem>
              </Select>
            </div>
          )}
        </div>
        <div className="mb-4">
          <TextField
            className="w-full"
            label="Start Date"
            type="date"
            variant="outlined"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="mb-4">
          <TextField
            className="w-full"
            label="End Date"
            type="date"
            variant="outlined"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="mb-4">
          <TextField
            className="w-full"
            label="Comment"
            variant="outlined"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="contained" onClick={onClose}>Save</Button>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
