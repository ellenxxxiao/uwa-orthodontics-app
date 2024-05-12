import { Avatar } from "@mui/material";

type Props = {
  firstName: string;
  lastName: string;
  avatar: string;
  size: number;
  online?: boolean;
};

export default function UserAvatar({
  avatar,
  firstName,
  lastName,
  size,
  online,
}: Props) {
  return (
    <div style={{ position: "relative" }}>
      {avatar ? (
        <Avatar
          src={avatar}
          sx={{ width: size, height: size }}
          variant="square"
          className="rounded-2xl"
        />
      ) : (
        <Avatar
          sx={{ width: size, height: size }}
          variant="square"
          className="rounded-2xl"
        >
          {firstName.charAt(0) + lastName.charAt(0)}
        </Avatar>
      )}
    </div>
  );
}
