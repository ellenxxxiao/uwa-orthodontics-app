import { LuChevronLeft } from "react-icons/lu";
import { LuBell } from "react-icons/lu";

import UserAvatar from "../UserAvatar";

type Props = {
  type: "primary" | "secondary";
  title: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export default function Header({
  type,
  firstName,
  lastName,
  avatar,
  title
}: Props) {
  return (
    <div className="sticky top-0 flex h-20 w-full items-center justify-between bg-primary px-4">
      <button>
        <LuChevronLeft size={38} strokeWidth={1.2} className="text-white" />
      </button>
      <div className="flex flex-col items-center gap-1 pt-2">
        <UserAvatar
          firstName={firstName}
          lastName={lastName}
          avatar={avatar}
          size={42}
        />
        <h1 className="text-sm font-bold text-white">{title}</h1>
      </div>
      <button className="invisible">
        <LuBell size={30} className="text-white" />
      </button>
    </div>
  );
}
