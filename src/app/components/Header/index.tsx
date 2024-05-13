import UserAvatar from "../UserAvatar"; // Importing the UserAvatar component

type Props = {
  type: "primary" | "secondary";
  iconLeft: React.ReactNode;
  iconRight?: React.ReactNode;
  title?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
};

export default function Header({
  type,
  iconLeft,
  iconRight,
  firstName,
  lastName,
  avatar,
  title,
}: Props) {
  switch (type) {
    case "secondary":
      return (
        <div className="px-4 w-full bg-primary h-20 sticky top-0 flex justify-between items-center">
          <button>{iconLeft}</button>
          <div className="pt-2 flex flex-col gap-1 items-center">
            <UserAvatar
              firstName={firstName!}
              lastName={lastName!}
              avatar={avatar!}
              size={42}
            />
            <h1 className="text-app-white text-sm font-bold">{title}</h1>
          </div>
          <button className="invisible">{iconRight}</button>
        </div>
      );

    case "primary":
      return (
        <div className="px-4 w-full bg-base-100 h-20 sticky top-0 flex justify-between items-center border-b border-base-300">
          <button>{iconLeft}</button>
          <div className=""></div>
          <button>{iconRight}</button>
        </div>
      );

    default:
      return null;
  }
}
