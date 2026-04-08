"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Menu, X, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onToggleMobileMenu?: () => void;
  mobileMenuOpen?: boolean;
}

export function Header({ user, onToggleMobileMenu, mobileMenuOpen }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {}
  }

  async function markAllRead() {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 md:px-6 glass-heavy">
      {/* Mobile: hamburger + logo */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          {mobileMenuOpen ? (
            <X size={20} className="text-neutral-600" />
          ) : (
            <Menu size={20} className="text-neutral-600" />
          )}
        </button>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-primary to-primary-dim flex items-center justify-center">
          <span className="text-white font-heading font-bold text-sm">M</span>
        </div>
        <span className="font-heading font-bold text-lg" style={{ color: "#2a3434" }}>
          MindStack
        </span>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden md:block" />

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
            className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-neutral-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-accent-500 rounded-full ring-2 ring-white flex items-center justify-center">
                <span className="text-[10px] font-bold text-white leading-none">{unreadCount > 9 ? "9+" : unreadCount}</span>
              </span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-12 w-[calc(100vw-2rem)] sm:w-96 max-w-[384px] bg-surface-container-lowest rounded-2xl shadow-card-hover z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3" style={{ background: "#eef5f4" }}>
                <h3 className="text-sm font-semibold text-neutral-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
                  >
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell size={24} className="mx-auto text-neutral-300 mb-2" />
                    <p className="text-sm text-neutral-400">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.link || "#"}
                      onClick={() => setOpen(false)}
                      className={`block px-4 py-3 hover:bg-surface-container-low transition-colors ${
                        !n.read ? "bg-primary-container/10" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {!n.read && (
                          <span className="mt-1.5 w-2 h-2 bg-primary-500 rounded-full shrink-0" />
                        )}
                        <div className={!n.read ? "" : "ml-5"}>
                          <p className="text-sm font-medium text-neutral-800 leading-snug">
                            {n.title}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                            {n.body}
                          </p>
                          <p className="text-[10px] text-neutral-400 mt-1">
                            {timeAgo(n.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          {user?.name && (
            <span className="hidden sm:block text-sm font-medium text-neutral-700">
              {user.name}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
