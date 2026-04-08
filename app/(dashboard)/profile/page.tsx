"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Copy,
  UserCircle,
  Sparkles,
  MapPin,
  Clock,
  IndianRupee,
  Save,
} from "lucide-react";
import { SPECIALIZATIONS, THERAPY_MODALITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) { e.preventDefault(); }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load profile");
        return r.json();
      })
      .then((data) => {
        setProfile(data.profile);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function copyBookingLink() {
    const url = `${window.location.origin}/book/${profile?.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments where clipboard API is not available
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="skeleton h-24 rounded-2xl mb-4" />
        <div className="skeleton h-64 rounded-2xl mb-4" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <UserCircle size={28} className="text-red-300" />
        </div>
        <p className="text-neutral-600 font-medium">{error}</p>
        <Button onClick={() => window.location.reload()} variant="secondary" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
          <UserCircle size={28} className="text-primary-300" />
        </div>
        <p className="text-neutral-600 font-medium">Profile not set up yet</p>
        <p className="text-neutral-400 text-sm mt-1">Complete onboarding to create your profile</p>
      </div>
    );
  }

  const initials = profile.displayName
    ? profile.displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="max-w-5xl mx-auto page-enter">
      {/* Header card with avatar */}
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 rounded-2xl p-5 md:p-6 mb-5 relative overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-[100px] h-[100px] rounded-full bg-white/10" />
        <div className="absolute bottom-[-20px] right-[60px] w-[60px] h-[60px] rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-4 ring-white/20 shadow-lg">
            <AvatarImage src={profile.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-xl md:text-2xl font-bold text-white truncate">
                {profile.displayName || "Your Name"}
              </h1>
              <Badge
                variant={
                  profile.verificationStatus === "VERIFIED"
                    ? "verified"
                    : profile.verificationStatus === "PENDING"
                      ? "pending"
                      : "unverified"
                }
                className={cn(
                  "shrink-0",
                  profile.verificationStatus === "VERIFIED" && "animate-sparkle"
                )}
              >
                {profile.verificationStatus === "VERIFIED" && (
                  <CheckCircle2 size={12} className="mr-1" />
                )}
                {profile.verificationStatus.toLowerCase()}
              </Badge>
            </div>
            {profile.city && (
              <p className="text-primary-100/70 text-sm flex items-center gap-1 mt-0.5">
                <MapPin size={12} /> {profile.city}, {profile.state}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Public profile link */}
      <Card className="mb-5 border-primary-100/50">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-neutral-700 flex items-center gap-1.5">
              <Sparkles size={14} className="text-primary-400" />
              Your public profile
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">
              mindstack.in/dr/{profile.slug}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={copyBookingLink} className="gap-1.5">
              <Copy size={14} />
              {copied ? "Copied!" : "Copy link"}
            </Button>
            <Button variant="secondary" size="sm" asChild className="gap-1.5">
              <a
                href={`/dr/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={14} /> Preview
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Completeness */}
      <ProfileCompleteness profile={profile} />

      {/* Basic Info */}
      <Card className="mb-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserCircle size={18} className="text-primary-500" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Display Name</Label>
            <Input
              value={profile.displayName || ""}
              onChange={(e) => {
                setProfile({ ...profile, displayName: e.target.value });
                setDirty(true);
              }}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea
              value={profile.bio || ""}
              onChange={(e) => {
                setProfile({ ...profile, bio: e.target.value });
                setDirty(true);
              }}
              rows={3}
              className="mt-1.5"
              placeholder="Tell colleagues about your practice approach..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>City</Label>
              <Input
                value={profile.city || ""}
                onChange={(e) => {
                  setProfile({ ...profile, city: e.target.value });
                  setDirty(true);
                }}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>State</Label>
              <Input
                value={profile.state || ""}
                onChange={(e) => {
                  setProfile({ ...profile, state: e.target.value });
                  setDirty(true);
                }}
                className="mt-1.5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specializations */}
      <Card className="mb-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles size={18} className="text-purple-500" />
            Specializations & Modalities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="text-sm mb-3 block">Presenting Concerns</Label>
          <div className="flex flex-wrap gap-2 mb-5">
            {SPECIALIZATIONS.map((spec) => {
              const selected = (profile.specializations || []).includes(spec);
              return (
                <button
                  key={spec}
                  onClick={() => {
                    const current = profile.specializations || [];
                    setProfile({
                      ...profile,
                      specializations: selected
                        ? current.filter((s: string) => s !== spec)
                        : [...current, spec],
                    });
                    setDirty(true);
                  }}
                  className={cn(
                    "pill-button",
                    selected
                      ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-300 hover:bg-primary-50"
                  )}
                >
                  {spec}
                </button>
              );
            })}
          </div>

          <Label className="text-sm mb-3 block">Therapy Modalities</Label>
          <div className="flex flex-wrap gap-2">
            {THERAPY_MODALITIES.map((mod) => {
              const selected = (profile.modalities || []).includes(mod);
              return (
                <button
                  key={mod}
                  onClick={() => {
                    const current = profile.modalities || [];
                    setProfile({
                      ...profile,
                      modalities: selected
                        ? current.filter((m: string) => m !== mod)
                        : [...current, mod],
                    });
                    setDirty(true);
                  }}
                  className={cn(
                    "pill-button",
                    selected
                      ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-blue-300 hover:bg-blue-50"
                  )}
                >
                  {mod}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Practice Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock size={18} className="text-amber-500" />
            Practice Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Session Duration (min)</Label>
              <Input
                type="number"
                value={profile.sessionDuration || 50}
                onChange={(e) => {
                  setProfile({
                    ...profile,
                    sessionDuration: Number(e.target.value),
                  });
                  setDirty(true);
                }}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Buffer Time (min)</Label>
              <Input
                type="number"
                value={profile.bufferTime || 10}
                onChange={(e) => {
                  setProfile({
                    ...profile,
                    bufferTime: Number(e.target.value),
                  });
                  setDirty(true);
                }}
                className="mt-1.5"
              />
            </div>
          </div>
          <div>
            <Label className="flex items-center gap-1.5">
              <IndianRupee size={14} className="text-green-500" />
              Session Fee (INR)
            </Label>
            <Input
              type="number"
              value={profile.sessionFee || ""}
              onChange={(e) => {
                setProfile({
                  ...profile,
                  sessionFee: Number(e.target.value),
                });
                setDirty(true);
              }}
              className="mt-1.5"
              placeholder="e.g. 1500"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-neutral-700">Booking Page</p>
              <p className="text-xs text-neutral-400">
                Allow clients to self-book via your link
              </p>
            </div>
            <Switch
              checked={profile.bookingPageEnabled}
              onCheckedChange={(v) => {
                setProfile({ ...profile, bookingPageEnabled: v });
                setDirty(true);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="pb-20 md:pb-4">
        <Button
          onClick={handleSave}
          className="w-full md:w-auto md:min-w-[200px] md:float-right h-12 shadow-lg gap-2"
          disabled={saving}
        >
          {saving ? (
            "Saving..."
          ) : saved ? (
            <>
              <CheckCircle2 size={16} /> Saved!
            </>
          ) : (
            <>
              <Save size={16} /> Save Changes
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 animate-shake">
          {error}
        </div>
      )}
    </div>
  );
}

interface CompletenessItem {
  key: string;
  label: string;
  hint: string;
  weight: number;
  completed: boolean;
}

function ProfileCompleteness({ profile }: { profile: any }) {
  const items: CompletenessItem[] = [
    {
      key: "displayName",
      label: "Display name",
      hint: "Add your display name",
      weight: 10,
      completed: Boolean(profile.displayName?.trim()),
    },
    {
      key: "bio",
      label: "Bio",
      hint: "Add your bio to help clients find you",
      weight: 15,
      completed: Boolean(profile.bio?.trim()),
    },
    {
      key: "location",
      label: "Location",
      hint: "Add your city and state for local visibility",
      weight: 10,
      completed: Boolean(profile.city?.trim() && profile.state?.trim()),
    },
    {
      key: "specializations",
      label: "Specializations",
      hint: "Select your specializations to attract the right clients",
      weight: 15,
      completed: Array.isArray(profile.specializations) && profile.specializations.length > 0,
    },
    {
      key: "modalities",
      label: "Therapy modalities",
      hint: "Add your therapy modalities",
      weight: 10,
      completed: Array.isArray(profile.modalities) && profile.modalities.length > 0,
    },
    {
      key: "languages",
      label: "Languages",
      hint: "List the languages you practice in",
      weight: 10,
      completed: Array.isArray(profile.languages) && profile.languages.length > 0,
    },
    {
      key: "sessionFee",
      label: "Session fee",
      hint: "Set your session fee so clients know what to expect",
      weight: 10,
      completed: Boolean(profile.sessionFee && profile.sessionFee > 0),
    },
    {
      key: "credential",
      label: "Credential number",
      hint: "Add your RCI or NMC number for verification",
      weight: 10,
      completed: Boolean(profile.rciNumber?.trim() || profile.nmcNumber?.trim()),
    },
    {
      key: "avatarUrl",
      label: "Profile photo",
      hint: "Upload a profile photo to build trust with clients",
      weight: 10,
      completed: Boolean(profile.avatarUrl?.trim()),
    },
  ];

  const completeness = items.reduce(
    (sum, item) => sum + (item.completed ? item.weight : 0),
    0
  );

  if (completeness >= 100) return null;

  const incompleteItems = items.filter((item) => !item.completed);

  return (
    <Card className="mb-5 border-0 bg-gradient-to-br from-primary-50 to-teal-50 shadow-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-neutral-700">
            Profile completeness
          </h3>
          <span className="text-sm font-bold text-primary-600">{completeness}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/60 rounded-full h-2.5 mb-4">
          <div
            className="bg-gradient-to-r from-primary-400 to-teal-400 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.key} className="flex items-start gap-2">
              {item.completed ? (
                <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
              ) : (
                <Circle size={16} className="text-neutral-300 mt-0.5 shrink-0" />
              )}
              <span
                className={cn(
                  "text-sm",
                  item.completed
                    ? "text-neutral-500 line-through"
                    : "text-neutral-600"
                )}
              >
                {item.completed ? item.label : item.hint}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
