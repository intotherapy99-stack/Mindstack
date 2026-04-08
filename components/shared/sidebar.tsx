"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  MessageSquare,
  ArrowRightLeft,
  GraduationCap,
} from "lucide-react";

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

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true";
    }
    return false;
  });

  const isOnSupervision = pathname?.startsWith("/supervision") ?? false;
  const [supervisionOpen, setSupervisionOpen] = useState(isOnSupervision);

  useEffect(() => {
    if (isOnSupervision) setSupervisionOpen(true);
  }, [isOnSupervision]);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  function isItemActive(href: string, hasChildren?: boolean) {
    if (hasChildren) return false;
    if (href === "/supervision") return pathname === "/supervision";
    return pathname === href || pathname?.startsWith(href + "/");
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
      style={{ background: "#ffffff" }}
    >
      {/* Logo — tonal shift instead of border */}
      <div className="flex items-center justify-between p-4" style={{ background: "#eef5f4" }}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-primary to-primary-dim flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">M</span>
            </div>
            <span className="font-heading font-bold text-lg" style={{ color: "#2a3434" }}>
              MindStack
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-primary to-primary-dim flex items-center justify-center mx-auto">
            <span className="text-white font-heading font-bold text-sm">M</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-surface-container-low text-on-surface-variant hidden lg:block transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {navigation.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#6f7978" }}>
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              if (item.children) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setSupervisionOpen(!supervisionOpen)}
                      className={cn(
                        "flex items-center gap-3 mx-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors w-[calc(100%-16px)]",
                        isOnSupervision
                          ? "text-supervision"
                          : "text-on-surface-variant hover:bg-surface-container-low"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon
                        size={20}
                        className={cn(
                          isOnSupervision ? "text-supervision" : "text-outline"
                        )}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          <ChevronDown
                            size={14}
                            className={cn(
                              "text-outline transition-transform duration-200",
                              supervisionOpen && "rotate-180"
                            )}
                          />
                        </>
                      )}
                    </button>
                    {(supervisionOpen || collapsed) && (
                      <div className={cn(!collapsed && "ml-4 mt-0.5")}>
                        {item.children.map((child) => {
                          const childActive = isItemActive(child.href);
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                "flex items-center gap-3 mx-2 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-colors",
                                childActive
                                  ? "bg-supervision-light text-supervision"
                                  : "text-on-surface-variant hover:bg-surface-container-low"
                              )}
                              title={collapsed ? child.name : undefined}
                            >
                              <child.icon
                                size={16}
                                className={cn(
                                  childActive ? "text-supervision" : "text-outline"
                                )}
                              />
                              {!collapsed && <span>{child.name}</span>}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = isItemActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 mx-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-container/30 text-primary"
                      : "text-on-surface-variant hover:bg-surface-container-low"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon
                    size={20}
                    className={cn(
                      isActive ? "text-primary" : "text-outline"
                    )}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom — tonal shift instead of border */}
      <div className="p-3" style={{ background: "#eef5f4" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <LogOut size={20} className="text-outline" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
