"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  Bell,
  Calendar,
  CreditCard,
  Database,
  Check,
  Settings,
  Sparkles,
  Download,
  Trash2,
  MessageSquare,
  Moon,
  Crown,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function handleDarkModeToggle(v: boolean) {
    document.documentElement.classList.toggle("dark", v);
    localStorage.setItem("theme", v ? "dark" : "light");
    setDarkMode(v);
  }

  async function handleExportData() {
    setExporting(true);
    try {
      const res = await fetch("/api/users/me/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.headers.get("Content-Disposition")
        ?.match(/filename="(.+)"/)?.[1] || "mindstack-data-export.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully");
    } catch {
      toast.error("Failed to export data. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== "DELETE") return;
    setDeleting(true);
    try {
      const res = await fetch("/api/users/me", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete account");
      }
      toast.success("Account deleted. Redirecting...");
      // Sign out and redirect to home
      window.location.href = "/login";
    } catch (err: any) {
      toast.error(err.message);
      setDeleting(false);
    }
  }

  const [notifications, setNotifications] = useState({
    bookingConfirmed: true,
    sessionReminder: true,
    paymentReceived: true,
    newReview: true,
    preferWhatsApp: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("notification-prefs");
    if (saved) {
      try { setNotifications(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notification-prefs", JSON.stringify(notifications));
  }, [notifications]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [userRes, availRes] = await Promise.all([
        fetch("/api/users/me"),
        fetch("/api/availability"),
      ]);
      if (!userRes.ok) throw new Error("Failed to load account details");
      if (!availRes.ok) throw new Error("Failed to load availability");
      const [userData, availData] = await Promise.all([
        userRes.json(),
        availRes.json(),
      ]);
      setUser(userData);
      setAvailability(availData);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveAvailability() {
    setSaving(true);
    try {
      const res = await fetch("/api/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots: availability }),
      });
      if (!res.ok) throw new Error("Failed to save availability");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err?.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function addSlot(dayOfWeek: number) {
    // Find the latest end time for this day to suggest the next slot
    const daySlots = availability.filter((s) => s.dayOfWeek === dayOfWeek);
    let startHour = 9;
    if (daySlots.length > 0) {
      const lastEnd = daySlots
        .map((s) => parseInt(s.endTime?.split(":")[0] || "9", 10))
        .sort((a, b) => b - a)[0];
      startHour = Math.min(lastEnd, 21); // Cap at 21:00 so end doesn't exceed 22:00
    }
    const startTime = `${String(startHour).padStart(2, "0")}:00`;
    const endTime = `${String(startHour + 1).padStart(2, "0")}:00`;
    setAvailability([
      ...availability,
      { dayOfWeek, startTime, endTime, isActive: true },
    ]);
  }

  function removeSlot(index: number) {
    setAvailability(availability.filter((_, i) => i !== index));
  }

  function updateSlot(index: number, field: string, value: string | boolean) {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto page-enter">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neutral-500 to-neutral-600 flex items-center justify-center">
            <Settings size={18} className="text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">Settings</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse"><CardContent className="h-32" /></Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-4xl mx-auto page-enter">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neutral-500 to-neutral-600 flex items-center justify-center">
            <Settings size={18} className="text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">Settings</h1>
        </div>
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">Unable to load settings</h2>
            <p className="text-sm text-neutral-500 mb-4 max-w-sm">{error}</p>
            <Button onClick={loadData} className="gap-2">
              <RefreshCw size={14} /> Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const plan = user?.subscription?.plan || "FREE";

  return (
    <div className="max-w-4xl mx-auto page-enter">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neutral-600 to-neutral-700 flex items-center justify-center">
          <Settings size={18} className="text-white" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">
            Settings
          </h1>
          <p className="text-neutral-500 text-xs">Manage your account & preferences</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <Tabs defaultValue="account" className="space-y-6">
        <div className="relative">
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 rounded-r-xl sm:hidden" />
          <TabsList className="w-full justify-start bg-white border border-neutral-200 p-1 h-auto rounded-xl shadow-card overflow-x-auto flex-nowrap scrollbar-hide">
            <TabsTrigger value="account" className="gap-1.5 rounded-lg min-h-[44px] px-3 shrink-0 text-xs sm:text-sm">
              <User size={14} /> Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5 rounded-lg min-h-[44px] px-3 shrink-0 text-xs sm:text-sm">
              <Bell size={14} /> Notifications
            </TabsTrigger>
            <TabsTrigger value="availability" className="gap-1.5 rounded-lg min-h-[44px] px-3 shrink-0 text-xs sm:text-sm">
              <Calendar size={14} /> Availability
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-1.5 rounded-lg min-h-[44px] px-3 shrink-0 text-xs sm:text-sm">
              <CreditCard size={14} /> Billing
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-1.5 rounded-lg min-h-[44px] px-3 shrink-0 text-xs sm:text-sm">
              <Database size={14} /> Data
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Account */}
        <TabsContent value="account">
          {/* Dark Mode Toggle */}
          <Card className="shadow-card mb-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <Moon size={14} className="text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800">Dark Mode</p>
                    <p className="text-xs text-neutral-400">Switch between light and dark themes</p>
                  </div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={18} className="text-primary-500" />
                Account Details
              </CardTitle>
              <CardDescription>Manage your email, phone, and password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled className="mt-1 bg-neutral-50" />
                <p className="text-xs text-neutral-400 mt-1">Contact support to change your email</p>
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={user?.phone || ""} disabled className="mt-1 bg-neutral-50" />
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <Label>Change Password</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  disabled={changingPassword || !currentPassword || !newPassword}
                  onClick={async () => {
                    setChangingPassword(true);
                    try {
                      const res = await fetch("/api/users/me", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ currentPassword, newPassword }),
                      });
                      if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data.error || "Failed to update password");
                      }
                      toast.success("Password updated");
                      setCurrentPassword("");
                      setNewPassword("");
                    } catch (err: any) {
                      toast.error(err?.message || "Failed to update password");
                    } finally {
                      setChangingPassword(false);
                    }
                  }}
                >
                  {changingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={18} className="text-amber-500" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { key: "bookingConfirmed", label: "Booking confirmations", desc: "When a session is booked or confirmed", icon: Calendar, color: "text-primary-500" },
                { key: "sessionReminder", label: "Session reminders", desc: "24h and 2h before each session", icon: Bell, color: "text-blue-500" },
                { key: "paymentReceived", label: "Payment received", desc: "When you log a payment", icon: CreditCard, color: "text-green-500" },
                { key: "newReview", label: "New reviews", desc: "When a supervisee leaves a review", icon: Sparkles, color: "text-purple-500" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <Icon size={14} className={item.color} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{item.label}</p>
                        <p className="text-xs text-neutral-400">{item.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={(notifications as any)[item.key]}
                      onCheckedChange={(v) =>
                        setNotifications({ ...notifications, [item.key]: v })
                      }
                    />
                  </div>
                );
              })}
              <div className="pt-4 mt-2 border-t border-neutral-100">
                <div className="flex items-center justify-between px-3 py-3 rounded-lg bg-green-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <MessageSquare size={14} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">Prefer WhatsApp</p>
                      <p className="text-xs text-neutral-400">Send reminders via WhatsApp instead of email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.preferWhatsApp}
                    onCheckedChange={(v) =>
                      setNotifications({ ...notifications, preferWhatsApp: v })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability */}
        <TabsContent value="availability">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={18} className="text-blue-500" />
                Weekly Availability
              </CardTitle>
              <CardDescription>Set your recurring availability for sessions and supervision</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DAYS.map((day, dayIndex) => {
                  const daySlots = availability.filter((s) => s.dayOfWeek === dayIndex);
                  const isWeekend = dayIndex === 0 || dayIndex === 6;

                  return (
                    <div
                      key={day}
                      className={`flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-3 px-3 rounded-lg border transition-colors ${
                        daySlots.length > 0
                          ? "border-primary-100 bg-primary-50/30"
                          : isWeekend
                            ? "border-neutral-100 bg-neutral-50/50"
                            : "border-neutral-100"
                      }`}
                    >
                      <div className="w-20 shrink-0 pt-1">
                        <p className={`text-sm font-semibold ${daySlots.length > 0 ? "text-primary-700" : "text-neutral-500"}`}>
                          {DAY_SHORT[dayIndex]}
                        </p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {daySlots.length === 0 ? (
                          <p className="text-sm text-neutral-400 py-1">Not available</p>
                        ) : (
                          daySlots.map((slot) => {
                            const slotIdx = availability.indexOf(slot);
                            return (
                              <div key={slotIdx} className="flex flex-wrap items-center gap-2">
                                <Input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) => updateSlot(slotIdx, "startTime", e.target.value)}
                                  className="w-full sm:w-28 text-sm"
                                />
                                <span className="text-neutral-400 text-sm hidden sm:inline">to</span>
                                <Input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) => updateSlot(slotIdx, "endTime", e.target.value)}
                                  className="w-full sm:w-28 text-sm"
                                />
                                <button
                                  onClick={() => removeSlot(slotIdx)}
                                  className="text-neutral-400 hover:text-red-500 text-xs px-2 py-1 min-h-[44px] sm:min-h-0 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            );
                          })
                        )}
                        <button
                          onClick={() => addSlot(dayIndex)}
                          className="text-xs text-primary-500 hover:text-primary-700 font-medium transition-colors min-h-[44px] sm:min-h-0 flex items-center"
                        >
                          + Add time slot
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Button onClick={saveAvailability} disabled={saving}>
                  {saving ? "Saving..." : saved ? "Saved!" : "Save Availability"}
                </Button>
                {saved && (
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <Check size={16} /> Changes saved
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-500" />
                Subscription & Billing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-neutral-50 to-primary-50/30 rounded-xl mb-6 border border-neutral-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-neutral-900">
                      {plan === "FREE" ? "Free Plan" : plan === "SOLO" ? "Solo Plan" : plan === "SOLO_ANNUAL" ? "Solo Annual" : "Clinic Plan"}
                    </p>
                    <Badge variant={plan === "FREE" ? "unverified" : "active"}>
                      {plan === "FREE" ? "Current" : "Active"}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">
                    {plan === "FREE"
                      ? "5 clients, 10 appointments/month, limited features"
                      : "Unlimited clients, appointments, and all features"}
                  </p>
                </div>
                {plan === "FREE" && (
                  <Button className="gap-1.5">
                    <Crown size={14} /> Upgrade
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <PlanCard
                  name="Solo"
                  price="₹799/mo"
                  features={["Unlimited clients", "Unlimited appointments", "Payment tracking", "Analytics", "Notes export"]}
                  current={plan === "SOLO"}
                  color="primary"
                />
                <PlanCard
                  name="Solo Annual"
                  price="₹7,999/yr"
                  features={["Everything in Solo", "Save ₹1,589/year", "Priority support"]}
                  current={plan === "SOLO_ANNUAL"}
                  highlighted
                  color="accent"
                />
                <PlanCard
                  name="Clinic"
                  price="₹2,499/mo"
                  features={["Up to 5 practitioners", "Shared client pool", "Team calendar", "Clinic reporting"]}
                  current={plan === "CLINIC"}
                  color="purple"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data */}
        <TabsContent value="data">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={18} className="text-green-500" />
                Your Data
              </CardTitle>
              <CardDescription>DPDP Act compliant — download or delete your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Download size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800">Download my data</p>
                    <p className="text-xs text-neutral-400">Get a JSON export of all your data</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={handleExportData} disabled={exporting}>
                  {exporting ? <><RefreshCw size={14} className="mr-1.5 animate-spin" /> Exporting...</> : "Download"}
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <Trash2 size={18} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-800">Delete my account</p>
                    <p className="text-xs text-red-400">Permanently delete all data. This cannot be undone.</p>
                  </div>
                </div>
                <Button variant="danger" size="sm" onClick={() => setDeleteConfirmOpen(true)}>Delete Account</Button>
              </div>

              {/* Delete Confirmation */}
              {deleteConfirmOpen && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">This action is irreversible</p>
                      <p className="text-xs text-red-600 mt-1">
                        All your data — clients, appointments, payments, notes, and settings — will be permanently deleted.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-red-700">Type DELETE to confirm</Label>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="DELETE"
                      className="border-red-200 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={deleteConfirmText !== "DELETE" || deleting}
                      onClick={handleDeleteAccount}
                    >
                      {deleting ? <><RefreshCw size={14} className="mr-1.5 animate-spin" /> Deleting...</> : "Permanently Delete"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setDeleteConfirmOpen(false); setDeleteConfirmText(""); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PlanCard({
  name,
  price,
  features,
  current,
  highlighted,
  color,
}: {
  name: string;
  price: string;
  features: string[];
  current: boolean;
  highlighted?: boolean;
  color?: string;
}) {
  const borderColor = highlighted
    ? "border-accent-500 bg-gradient-to-b from-accent-50/50 to-white"
    : current
      ? "border-green-300 bg-gradient-to-b from-green-50/50 to-white"
      : "border-neutral-200 hover:border-neutral-300";

  const checkColor = color === "accent"
    ? "text-accent-500"
    : color === "purple"
      ? "text-purple-500"
      : "text-primary-500";

  return (
    <div className={`rounded-xl border-2 p-5 transition-all card-lift ${borderColor}`}>
      {highlighted && (
        <Badge className="bg-accent-500 text-white text-[10px] mb-2">Best Value</Badge>
      )}
      <p className="font-heading font-bold text-neutral-900">{name}</p>
      <p className="text-xl font-bold text-neutral-900 mt-1">{price}</p>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-neutral-600">
            <Check size={12} className={`${checkColor} shrink-0`} />
            {f}
          </li>
        ))}
      </ul>
      {current ? (
        <Badge variant="active" className="mt-4">Current plan</Badge>
      ) : (
        <Button variant="secondary" size="sm" className="w-full mt-4">
          Choose {name}
        </Button>
      )}
    </div>
  );
}
