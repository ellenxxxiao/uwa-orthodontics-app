import React from "react";
import { Card, CardContent, Button, Typography } from "@mui/material";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

interface UserCardProps {
  user: User;
  onDelete: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {user.name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {user.email}
        </Typography>
        <Typography variant="body2" component="p">
          Username: {user.username}
        </Typography>
        <Button variant="contained" color="error" onClick={() => onDelete(user.id)}>
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserCard;
