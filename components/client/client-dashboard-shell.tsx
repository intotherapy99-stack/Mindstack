"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Calendar,
  CreditCard,
  User,
  LogOut,
  Heart,
  Pill,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface Props {
  user: any;
  children: React.ReactNode;
}

const navItems = [
  { href: "/my-care", label: "Home", icon: Home },
  { href: "/find-therapist", label: "Find", icon: Search },
  { href: "/my-sessions", label: "Sessions", icon: Calendar },
  { href: "/my-payments", label: "Payments", icon: CreditCard },
  { href: "/my-prescriptions", label: "Rx", icon: Pill },
  { href: "/my-profile", label: "Profile", icon: User },
];

export function ClientDashboardShell({ user, children }: Props) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/my-care" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Heart size={14} className="text-white fill-white" />
            </div>
            <span className="font-heading font-bold text-base text-neutral-900">
              MindStack
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500 hidden sm:block">
              Hi, {user.name?.split(" ")[0] || "there"}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
              title="Sign out"
            >
              <LogOut size={15} className="text-neutral-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-6 pb-28">
        {children}
      </main>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-neutral-200"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-around px-2 py-1.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 min-w-[48px] sm:min-w-[56px] min-h-[44px] justify-center rounded-lg transition-colors active:scale-95 ${
                  isActive
                    ? "text-primary-600"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={`text-[11px] ${isActive ? "font-semibold" : "font-medium"}`}>
                  {label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-primary-500 -mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
