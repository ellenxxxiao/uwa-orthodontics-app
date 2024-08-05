import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";

interface addReminderProps {
  handleEditClick?:()=>{}
}

const ReminderCard = ({handleEditClick}:addReminderProps) => {
  const [isSwiping, setIsSwiping] = useState(false);

  const handleMouseEnter = () => setIsSwiping(true);
  const handleMouseLeave = () => setIsSwiping(false);


  return (
    <Card
      sx={{
        width: "100%",
        boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.15)",
        transition: "transform 0.3s ease-in-out",
        borderRadius: 2,
        display: "flex",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Stack direction="row" width="100%">
        <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
          <Avatar sx={{ bgcolor: deepOrange[500] }}>N</Avatar>
        </Box>

        <CardContent
          sx={{ flex: "1 1 auto", display: "flex", flexDirection: "column" }}
        >
          <Typography variant="body2" fontSize="16px">
            Name: Neha
          </Typography>
          <Typography variant="body2" fontSize="14px">
            Reminder: Repeat
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "top", py:2, px:1}}>
          <Chip size="small" label="Appointment" sx={{ backgroundColor: "orange", color:"white" }} />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            transform: "translateX(100%)",
            transition: "transform 0.3s ease-in-out",
            //   justifyContent: "center",
            ...(isSwiping && { transform: "translateX(0)" }),
          }}
          className="flex flex-row"
        >
          <Box
            className="flex flex-col"
            sx={{
              background: "#c4c4c4",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <IconButton aria-label="edit">
              <EditIcon sx={{ color: "white" }}  onClick ={handleEditClick}/>
            </IconButton>
          </Box>
          <Box
            className="flex flex-col"
            sx={{ background: "red", height: "100%", justifyContent: "center" }}
          >
            <IconButton aria-label="delete">
              <DeleteIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
        </Box>
      </Stack>
    </Card>
  );
};

export default ReminderCard;