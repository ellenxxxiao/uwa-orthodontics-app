"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { LuBell, LuMessageCircle, LuSettings, LuUser2 } from "react-icons/lu";

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
          <div className="mx-auto mb-32 mt-6 h-12 w-12">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "rounded-lg w-full h-full",
                  userButtonTrigger: "focus:rounded-lg"
                }
              }}
            />
          </div>

          {/* menu items */}
          <div className="flex w-full flex-col items-center justify-between gap-10 lg:items-start lg:pl-10 ">
            <Link href="/chat-list" className="flex items-center gap-2">
              <LuMessageCircle
                size={38}
                strokeWidth={1.3}
                className={`text-primary ${isActive("/chat") ? "fill-current" : ""}`}
              />
              <span className="hidden lg:inline">Chat</span>
            </Link>

            <Link href="/reminder-list" className="flex items-center gap-2">
              <LuBell
                size={38}
                strokeWidth={1.3}
                className={`text-primary ${isActive("/reminder-list") ? "fill-current" : ""}`}
              />
              <span className="hidden lg:inline">Reminder</span>
            </Link>

            <Link href="/settings" className="flex items-center gap-2">
              <LuSettings
                size={38}
                strokeWidth={1.3}
                className={`text-primary ${isActive("/settings") ? "fill-current" : ""}`}
              />
              <span className="hidden lg:inline">Settings</span>
            </Link>

            <Link href="/manage-user" className="flex items-center gap-2">
              <LuUser2
                size={38}
                strokeWidth={1.3}
                className={`text-primary ${isActive("/manage-user") ? "fill-current" : ""}`}
              />
              <span className="hidden lg:inline">Admin</span>
            </Link>
          </div>
        </div>
      </SignedIn>
    </>
  );
}

// <SignedOut>
// <SignInButton />
// </SignedOut>
