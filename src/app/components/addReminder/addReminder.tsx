import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";


export default function AddReminer() {
  return (
    <div className="flex flex-col gap-4">
      <Box
        className="flex flex-row justify-between "
        sx={{
          width: "100%",
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.3s ease-in-out",
          borderRadius: 1,
          display: "flex",
          p: 1
        }}
      >
        <Typography className="self-center">Patient</Typography>
        <Autocomplete
          className="self-center"
          disablePortal
          id="combo-box-demo"
          options={["Neha1", "Neha2", "Neha3"]}
          sx={{ width: "50%", }}
          renderInput={(params) => (
            <TextField {...params}  />
          )}
        />
      </Box>
      <Box
        className="justify-between "
        sx={{
          width: "100%",
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.3s ease-in-out",
          borderRadius: 1,
          display: "flex",
          p: 1
        }}
      >
        <Typography className="self-center">Repeat</Typography>
        <select className="w-[50%] " name="Type" id="Type">
          <option value="kiwi">Custom</option>
          <option value="apple">Yearly</option>
          <option value="banana">Monthly</option>
          <option value="orange">Weekly</option>
          <option value="grape">Never</option>
        </select>
      </Box>
      <Box
        className="justify-between "
        sx={{
          width: "100%",
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.3s ease-in-out",
          borderRadius: 1,
          display: "flex",
          p: 1
        }}
      >
        <Typography className="self-center">Start Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker />
          </DemoContainer>
        </LocalizationProvider>
      </Box>
      <Box
        className="justify-between "
        sx={{
          width: "100%",
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.3s ease-in-out",
          borderRadius: 1,
          display: "flex",
          p: 1
        }}
      >
        <Typography className="self-center">End Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker />
          </DemoContainer>
        </LocalizationProvider>
      </Box>
      <Box
        className="justify-between "
        sx={{
          width: "100%",
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.3s ease-in-out",
          borderRadius: 1,
          display: "flex",
          p: 1
        }}
      >
        <Typography className="self-center">Time</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker']}>
        <TimePicker label="Basic time picker" />
      </DemoContainer>
    </LocalizationProvider>
      </Box>
      <Box
        className="justify-between "
        sx={{
          width: "100%",
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.3s ease-in-out",
          borderRadius: 1,
          display: "flex",
          p: 1
        }}
      >
        <Typography className="self-center">Type</Typography>
        <select className="w-[50%] " name="Type" id="Type">
          <option value="kiwi">Custom</option>
          <option value="apple">Yearly</option>
          <option value="banana">Monthly</option>
          <option value="orange">Weekly</option>
          <option value="grape">Never</option>
        </select>
      </Box>
      <Box
        className="justify-between "
        sx={{
          width: "100%",
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.3s ease-in-out",
          borderRadius: "4px",
          display: "flex"
        }}
      >
        <textarea
          placeholder="Notes"
          style={{ width: "100%", borderRadius: "4px",padding:"10px" }}
        />
      </Box>
    </div>
  );
}
