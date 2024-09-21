import UserAvatar from "../UserAvatar"; // Importing the UserAvatar component

type Props = {
  type: "primary" | "secondary";
  iconLeft: React.ReactNode;
  iconRight?: React.ReactNode;
  title?: string;
  fullName?: string;
  avatar?: string;
};

export default function Header({
  type,
  iconLeft,
  iconRight,
  fullName,
  avatar,
  title
}: Props) {
  switch (type) {
    case "secondary":
      return (
        <div className="sticky top-0 flex h-20 w-full items-center justify-between bg-primary px-4">
          <button>{iconLeft}</button>
          <div className="flex flex-col items-center gap-1 pt-2">
            <UserAvatar fullName={fullName!} avatar={avatar!} size={42} />
            <h1 className="text-sm font-bold text-app-white">{title}</h1>
          </div>
          <button className="invisible">{iconRight}</button>
        </div>
      );

    case "primary":
      return (
        <div className="sticky top-0 flex h-20 w-full items-center justify-between border-b border-base-300 bg-base-100 px-4">
          <button>{iconLeft}</button>
          <div className="text-sm font-bold text-gray-500 ">{title}</div>
          <button>{iconRight}</button>
        </div>
      );

    default:
      return null;
  }
}
