"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowRightLeft, MessageSquare } from "lucide-react";

const tabs = [
  { name: "Referrals", href: "/community/referrals", icon: ArrowRightLeft },
  { name: "Spaces", href: "/community/spaces", icon: MessageSquare },
];

export function CommunityTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 bg-neutral-100 rounded-lg p-1 mb-6">
      {tabs.map((tab) => {
        const isActive = pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            <tab.icon size={16} />
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
