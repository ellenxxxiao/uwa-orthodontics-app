"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { IconType } from "react-icons";
import { LuBell, LuMessageCircle, LuSettings, LuUser2 } from "react-icons/lu";

interface NavItemProps {
  icon: IconType;
  label: string;
  href: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  href,
  isActive
}) => {
  return (
    <Link href={href} className="flex items-center gap-2">
      <Icon
        size={38}
        strokeWidth={1.3}
        className={`text-primary ${isActive ? "fill-current" : ""}`}
      />
      <span className="hidden font-medium xl:inline xl:text-xl">{label}</span>
    </Link>
  );
};

export default function NavBar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <>
      <SignedIn>
        <div className="h-screen w-1/6 min-w-16 max-w-60">
          {/* avatar */}
          <div className="mx-auto mb-32 mt-6 h-12 w-12 md:h-24 md:w-24">
            <UserButton
              appearance={{
                elements: {
                  userButtonBox: "h-12 w-12 md:h-24 md:w-24",
                  avatarBox: "rounded-lg w-full h-full",
                  userButtonTrigger: "focus:rounded-lg"
                }
              }}
            />
          </div>

          {/* menu items */}
          <div className="flex w-full flex-col items-center justify-between gap-10 xl:items-start xl:pl-10 ">
            <NavItem
              icon={LuMessageCircle}
              label="Chat"
              href="/chat-list"
              isActive={isActive("/chat")}
            />
            <NavItem
              icon={LuBell}
              label="Reminder"
              href="/reminder-list"
              isActive={isActive("/reminder-list")}
            />
            <NavItem
              icon={LuUser2}
              label="Admin"
              href="/manage-user"
              isActive={isActive("/manage-user")}
            />
          </div>
        </div>
      </SignedIn>
    </>
  );
}

// <SignedOut>
// <SignInButton />
// </SignedOut>
