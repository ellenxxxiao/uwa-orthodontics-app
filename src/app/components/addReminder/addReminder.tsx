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
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useState } from "react";
import React from "react";

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
          style={{ width: "200px", border: "none" }}
          renderInput={(params) => (
            <TextField {...params} sx={{ border: "none" }} />
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
        <FormControl sx={{ width: "200px" }}>
          <InputLabel id="demo-simple-select-label">Repeat</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={repeat}
            label="Repeat"
            onChange={handleChangeRepeat}
          >
            <MenuItem value={1}>Weekly</MenuItem>
            <MenuItem value={2}>Monthly</MenuItem>
            <MenuItem value={3}>Yearly</MenuItem>
            <MenuItem value={4}>Custom</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        className="flex flex-col "
        sx={{
          width: "100%",
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.3s ease-in-out",
          borderRadius: 1,
          display: "flex",
        }}
      >
        <Box
          className="justify-between"
          sx={{
            width: "100%",
            borderRadius: 1,
            display: "flex",
            p: 1
          }}
        >
          <Typography className="self-center">Start Date</Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                slotProps={{
                  textField: {
                    sx: {
                      width: "200px",
                      borderWidth: "0px"
                    }
                  }
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>

        <Box
          className="justify-between "
          sx={{
            width: "100%",
            borderRadius: 1,
            display: "flex",
            p: 1
          }}
        >
          <Typography className="self-center">End Date</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                slotProps={{
                  textField: {
                    sx: {
                      width: "200px",
                      borderWidth: "0px"
                    }
                  }
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>

        <Box
          className="justify-between "
          sx={{
            width: "100%",
            borderRadius: 1,
            display: "flex",
            p: 1
          }}
        >
          <Typography className="self-center">Time</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
              <TimePicker
                label="Basic time picker"
                slotProps={{
                  textField: {
                    sx: {
                      width: "200px",
                      borderWidth: "0px"
                    }
                  }
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
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
        <FormControl sx={{ width: "200px" }}>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            label="Type"
            onChange={handleChangeType}
          >
            <MenuItem value={1}>Weekly</MenuItem>
            <MenuItem value={2}>Monthly</MenuItem>
            <MenuItem value={3}>Yearly</MenuItem>
            <MenuItem value={4}>Custom</MenuItem>
          </Select>
        </FormControl>
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
          style={{ width: "100%", borderRadius: "4px", padding: "10px" }}
        />
      </Box>
    </div>
  );
}
