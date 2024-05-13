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
  title,
}: Props) {
  return (
    <div className="px-4 w-full bg-primary h-20 sticky top-0 flex justify-between items-center">
      <button>
        <LuChevronLeft size={38} strokeWidth={1.2} className="text-white" />
      </button>
      <div className="pt-2 flex flex-col gap-1 items-center">
        <UserAvatar
          firstName={firstName}
          lastName={lastName}
          avatar={avatar}
          size={42}
        />
        <h1 className="text-white text-sm font-bold">{title}</h1>
      </div>
      <button className="invisible">
        <LuBell size={30} className="text-white" />
      </button>
    </div>
  );
}
