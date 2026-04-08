"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  UserCircle,
} from "lucide-react";

const mobileNavItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Community", href: "/community", icon: MessageSquare },
  { name: "Profile", href: "/profile", icon: UserCircle },
];

/* ── Mobile Nav: Glassmorphic floating dock per DESIGN.md ── */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-heavy px-2"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around py-1">
        {mobileNavItems.map((item) => {
          const isCommunity = item.href.startsWith("/community");
          const isActive = isCommunity
            ? pathname?.startsWith("/community")
            : pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-3 py-1 rounded-xl text-xs font-medium transition-all duration-150 active:scale-95",
                isActive ? "text-primary" : "text-outline"
              )}
            >
              <item.icon size={20} />
              <span className="text-[11px]">{item.name}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
