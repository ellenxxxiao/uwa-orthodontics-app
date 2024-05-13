import { LuMessageCircle, LuBell, LuSettings } from "react-icons/lu";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="px-4 w-full bg-base-100 h-20 sticky bottom-0 flex justify-between items-center border-t border-base-300">
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
