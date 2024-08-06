import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";

export default function SearchInput() {
  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        border: "0.1px solid grey", // Corrected border style
        borderRadius: "16px",
        boxShadow: "none", // Remove default box-shadow for 3D effect customization
        transition: "box-shadow 0.3s ease-in-out", // Enable hover effect
        "&:hover": {
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.35)" // Custom 3D hover effect
        }
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search..."
        inputProps={{ "aria-label": "Search" }}
      />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
