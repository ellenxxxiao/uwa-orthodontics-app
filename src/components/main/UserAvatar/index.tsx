function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string, borderRadius: string = "0.5rem") {
  if (!name) return { chilren: "", sx: {} };
  return {
    sx: {
      bgcolor: stringToColor(name),
      borderRadius: borderRadius
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`
  };
}

import { Avatar } from "@mui/material";

type Props = {
  fullName: string;
  size: number;
  avatar?: string;
  borderRadius?: string;
};

export default function UserAvatar({
  avatar,
  fullName,
  size,
  borderRadius
}: Props) {
  return (
    <div style={{ position: "relative" }}>
      {avatar ? (
        <Avatar
          src={avatar}
          sx={{ width: size, height: size }}
          variant="square"
        />
      ) : (
        <Avatar
          {...stringAvatar(fullName, borderRadius)} // Use the stringAvatar function
          sx={{
            ...stringAvatar(fullName, borderRadius).sx,
            width: size,
            height: size
          }} // Spread sx and override with size
          variant="square"
        />
      )}
    </div>
  );
}
