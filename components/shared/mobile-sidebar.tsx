"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  IndianRupee,
  Search,
  ClipboardList,
  Clock,
  UserCircle,
  BarChart3,
  Settings,
  ChevronDown,
  LogOut,
  MessageSquare,
  ArrowRightLeft,
  GraduationCap,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  children?: { name: string; href: string; icon: any }[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    label: "HOME",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "PRACTICE",
    items: [
      { name: "Clients", href: "/clients", icon: Users },
      { name: "Calendar", href: "/calendar", icon: Calendar },
      { name: "Notes", href: "/notes", icon: FileText },
      { name: "Payments", href: "/payments", icon: IndianRupee },
    ],
  },
  {
    label: "GROW",
    items: [
      {
        name: "Supervision",
        href: "/supervision",
        icon: GraduationCap,
        children: [
          { name: "Find Supervisors", href: "/supervision", icon: Search },
          { name: "My Sessions", href: "/supervision/sessions", icon: ClipboardList },
          { name: "Hours Log", href: "/supervision/hours-log", icon: Clock },
        ],
      },
      { name: "Community", href: "/community/spaces", icon: MessageSquare },
      { name: "Referrals", href: "/community/referrals", icon: ArrowRightLeft },
    ],
  },
  {
    label: "PROFILE",
    items: [
      { name: "My Profile", href: "/profile", icon: UserCircle },
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const isOnSupervision = pathname?.startsWith("/supervision") ?? false;
  const [supervisionOpen, setSupervisionOpen] = useState(isOnSupervision);

  useEffect(() => {
    if (isOnSupervision) setSupervisionOpen(true);
  }, [isOnSupervision]);

  function isItemActive(href: string) {
    if (href === "/supervision") return pathname === "/supervision";
    return pathname === href || pathname?.startsWith(href + "/");
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-16 left-0 bottom-0 z-50 w-[280px] bg-white border-r border-neutral-200 shadow-xl md:hidden transition-transform duration-300 ease-in-out overflow-y-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="py-4">
          {navigation.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="px-4 mb-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                {section.label}
              </p>
              {section.items.map((item) => {
                // Items with children render as a collapsible group
                if (item.children) {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => setSupervisionOpen(!supervisionOpen)}
                        className={cn(
                          "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-[calc(100%-16px)] min-h-[44px]",
                          isOnSupervision
                            ? "text-purple-700"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 active:bg-neutral-100"
                        )}
                      >
                        <item.icon
                          size={20}
                          className={cn(
                            isOnSupervision ? "text-purple-600" : "text-neutral-400"
                          )}
                        />
                        <span className="flex-1 text-left">{item.name}</span>
                        <ChevronDown
                          size={14}
                          className={cn(
                            "text-neutral-400 transition-transform duration-200",
                            supervisionOpen && "rotate-180"
                          )}
                        />
                      </button>
                      {supervisionOpen && (
                        <div className="ml-4 mt-0.5">
                          {item.children.map((child) => {
                            const childActive = isItemActive(child.href);
                            return (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={onClose}
                                className={cn(
                                  "flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors min-h-[40px]",
                                  childActive
                                    ? "bg-purple-50 text-purple-700"
                                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 active:bg-neutral-100"
                                )}
                              >
                                <child.icon
                                  size={16}
                                  className={cn(
                                    childActive ? "text-purple-600" : "text-neutral-400"
                                  )}
                                />
                                <span>{child.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Regular items
                const isActive = isItemActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px]",
                      isActive
                        ? "bg-primary-50 text-primary-600"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 active:bg-neutral-100"
                    )}
                  >
                    <item.icon
                      size={20}
                      className={cn(
                        isActive ? "text-primary-500" : "text-neutral-400"
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Log out */}
        <div className="border-t border-neutral-200 p-3 pb-safe">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors min-h-[44px]"
          >
            <LogOut size={20} className="text-neutral-400" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </>
  );
}
