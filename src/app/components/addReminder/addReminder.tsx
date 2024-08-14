import React from "react";
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function AddReminer() {
  const [repeat, setRepeat] = React.useState("");

  const handleChangeRepeat = (event: SelectChangeEvent) => {
    setRepeat(event.target.value as string);
  };

  const [type, setType] = React.useState("");

  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  return (
      <div className="w-full flex-1 flex flex-col overflow-hidden bg-base-100">
        <div className="flex-1 overflow-y-auto p-4">
      <Box
        className="flex flex-row mb-2 justify-between bg-white rounded-lg shadow"
        sx={{
          width: "100",
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.3s ease-in-out",
          borderRadius: 2,
          display: "flex",
          p: 1}}>
        <Typography className="self-center text-black">Patient</Typography>
        <Autocomplete
          className="self-center"
          disablePortal
          id="combo-box-demo"
          options={["Neha1", "Neha2", "Neha3"]}
          style={{ width: "200px", border: "none" }}
          renderInput={(params) => (<TextField {...params} sx={{ border: "none" }} />)}/>
      </Box>
      <Box
        className="flex flex-row mb-2 justify-between bg-white rounded-lg shadow"
        sx={{
          width: "100%",
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.3s ease-in-out",
          borderRadius: 2,
          display: "flex",
          p: 1}}>
        <Typography className="self-center text-black">Repeat</Typography>
        <FormControl sx={{ width: "200px" }}>
          <InputLabel id="demo-simple-select-label">Repeat</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={repeat}
            label="Repeat"
            onChange={handleChangeRepeat}>
            <MenuItem value={1}>Weekly</MenuItem>
            <MenuItem value={2}>Monthly</MenuItem>
            <MenuItem value={3}>Yearly</MenuItem>
            <MenuItem value={4}>Custom</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        className="flex flex-col mb-4 bg-white"
        sx={{
          width: "100%",
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.3s ease-in-out",
          borderRadius: 2,
          display: "flex"}}>
        <Box
          className="justify-between"
          sx={{
            width: "100%",
            borderRadius: 2,
            display: "flex",
            p: 1}}>
          <Typography className="self-center text-black">Start Date</Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker slotProps={{textField: { sx: {width: "200px",borderWidth: "0px"}}}}/>
            </DemoContainer>
          </LocalizationProvider>
        </Box>

        <Box
          className="justify-between"
          sx={{
            width: "100%",
            borderRadius: 2,
            display: "flex",
            p: 1}}>
          <Typography className="self-center text-black">End Date</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker slotProps={{ textField: {sx: {width: "200px",borderWidth: "0px"}}}}/>
            </DemoContainer>
          </LocalizationProvider>
        </Box>

        <Box
          className="justify-between"
          sx={{ width: "100%", borderRadius: 2, display: "flex", p: 1 }}>
          <Typography className="self-center text-black">Time</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
              <TimePicker
                label=""
                slotProps={{
                  textField: {
                    sx: {
                      width: "200px",
                      borderWidth: "0px"}}}}/>
            </DemoContainer>
          </LocalizationProvider>
        </Box>
      </Box>

      <Box
        className="justify-between mb-4 bg-white"
        sx={{
          width: "100%",
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.3s ease-in-out",
          borderRadius: 2,
          display: "flex",
          p: 1}}>
        <Typography className="self-center text-black">Type</Typography>
        <FormControl sx={{ width: "200px" }}>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            label="Type"
            onChange={handleChangeType}>
            <MenuItem value={1}>Aligner</MenuItem>
            <MenuItem value={2}>Appointment</MenuItem>
            <MenuItem value={3}>Custom</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        className="justify-between bg-white"
        sx={{
          width: "100%",
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.3s ease-in-out",
          borderRadius: 2,
          display: "flex"}}>
        <textarea
          placeholder="Notes"
          style={{ width: "100%", borderRadius: "4px", padding: "10px" }}/>
      </Box>
    </div>
    </div>
  );
}
