import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuBell, LuMessageCircle, LuSettings } from "react-icons/lu";

export default function Footer() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="sticky bottom-0 flex h-20 w-full items-center justify-between border-t border-base-300 bg-base-100 px-4">
      <Link href="/chat-list">
        <LuMessageCircle
          size={38}
          strokeWidth={1.3}
          className={`text-primary ${isActive("/chat-list") ? "fill-current" : ""}`}
        />
      </Link>

      <Link href="/reminder-list">
        <LuBell
          size={38}
          strokeWidth={1.3}
          className={`text-primary ${isActive("/reminder-list") ? "fill-current" : ""}`}
        />
      </Link>
      <Link href="/settings">
        <LuSettings
          size={38}
          strokeWidth={1.3}
          className={`text-primary ${isActive("/settings") ? "fill-current" : ""}`}
        />
      </Link>
    </div>
  );
}
