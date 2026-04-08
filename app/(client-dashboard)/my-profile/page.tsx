"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  CalendarDays,
  Briefcase,
  MapPin,
  Phone,
  Globe,
  LogOut,
  Save,
  Loader2,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface ProfileData {
  displayName: string;
  dateOfBirth: string | null;
  gender: string | null;
  occupation: string | null;
  city: string | null;
  state: string | null;
  emergencyContact: string | null;
  emergencyPhone: string | null;
  preferredLanguage: string | null;
}

const LANGUAGES = [
  "English", "Hindi", "Tamil", "Telugu", "Bengali",
  "Marathi", "Gujarati", "Kannada", "Malayalam",
];

const GENDERS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "NON_BINARY", label: "Non-binary" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

export default function MyProfile() {
  const [original, setOriginal] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/client-dashboard/profile")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        const p = data.profile;
        const profile: ProfileData = {
          displayName: p.displayName || "",
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split("T")[0] : "",
          gender: p.gender || "",
          occupation: p.occupation || "",
          city: p.city || "",
          state: p.state || "",
          emergencyContact: p.emergencyContact || "",
          emergencyPhone: p.emergencyPhone || "",
          preferredLanguage: p.preferredLanguage || "",
        };
        setOriginal(profile);
        setForm(profile);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (field: keyof ProfileData, value: string) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      const res = await fetch("/api/client-dashboard/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: form.displayName,
          dateOfBirth: form.dateOfBirth || null,
          gender: form.gender || null,
          occupation: form.occupation || null,
          city: form.city || null,
          state: form.state || null,
          emergencyContact: form.emergencyContact || null,
          emergencyPhone: form.emergencyPhone || null,
          preferredLanguage: form.preferredLanguage || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      const data = await res.json();
      const p = data.profile;
      const updated: ProfileData = {
        displayName: p.displayName || "",
        dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split("T")[0] : "",
        gender: p.gender || "",
        occupation: p.occupation || "",
        city: p.city || "",
        state: p.state || "",
        emergencyContact: p.emergencyContact || "",
        emergencyPhone: p.emergencyPhone || "",
        preferredLanguage: p.preferredLanguage || "",
      };
      setOriginal(updated);
      setForm(updated);
      setSaveSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = form && original && JSON.stringify(form) !== JSON.stringify(original);

  if (loading) {
    return (
      <div className="page-enter">
        <div className="skeleton h-40 rounded-2xl mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="page-enter">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-neutral-500 mb-4">Could not load your profile.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="pb-28 page-enter">
      {/* Header with gradient */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-[100px] h-[100px] rounded-full bg-white/10" />
        <div className="absolute bottom-[-20px] right-[80px] w-[70px] h-[70px] rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {form.displayName?.charAt(0) || "?"}
            </span>
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-white">
              {form.displayName}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="displayName" className="flex items-center gap-1.5">
            <User size={14} /> Display Name
          </Label>
          <Input
            id="displayName"
            value={form.displayName}
            onChange={(e) => updateField("displayName", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dob" className="flex items-center gap-1.5">
            <CalendarDays size={14} /> Date of Birth
          </Label>
          <Input
            id="dob"
            type="date"
            value={form.dateOfBirth || ""}
            onChange={(e) => updateField("dateOfBirth", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5">
            <User size={14} /> Gender
          </Label>
          <Select value={form.gender || ""} onValueChange={(v) => updateField("gender", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDERS.map((g) => (
                <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="occupation" className="flex items-center gap-1.5">
            <Briefcase size={14} /> Occupation
          </Label>
          <Input
            id="occupation"
            value={form.occupation || ""}
            onChange={(e) => updateField("occupation", e.target.value)}
            placeholder="e.g. Software Engineer"
          />
        </div>

        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="city" className="flex items-center gap-1.5">
              <MapPin size={14} /> City
            </Label>
            <Input
              id="city"
              value={form.city || ""}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="e.g. Mumbai"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={form.state || ""}
              onChange={(e) => updateField("state", e.target.value)}
              placeholder="e.g. Maharashtra"
            />
          </div>
        </div>

        <div className="pt-2">
          <p className="text-sm font-semibold text-neutral-700 mb-3">Emergency Contact</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="emergName" className="flex items-center gap-1.5">
                <User size={14} /> Name
              </Label>
              <Input
                id="emergName"
                value={form.emergencyContact || ""}
                onChange={(e) => updateField("emergencyContact", e.target.value)}
                placeholder="Contact name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emergPhone" className="flex items-center gap-1.5">
                <Phone size={14} /> Phone
              </Label>
              <Input
                id="emergPhone"
                type="tel"
                value={form.emergencyPhone || ""}
                onChange={(e) => updateField("emergencyPhone", e.target.value)}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5">
            <Globe size={14} /> Preferred Language
          </Label>
          <Select value={form.preferredLanguage || ""} onValueChange={(v) => updateField("preferredLanguage", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4">
          <Button
            variant="ghost"
            className="text-accent-500 hover:text-accent-600 hover:bg-accent-50 gap-2 w-full min-h-[44px]"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </div>

      {/* Sticky Save */}
      <div className="fixed bottom-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-neutral-100 p-3 sm:p-4 z-30" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}>
        <div className="max-w-2xl mx-auto">
          {saveSuccess && (
            <p className="text-xs text-green-600 text-center mb-2 font-medium">
              Profile saved successfully!
            </p>
          )}
          {error && form && (
            <p className="text-xs text-accent-500 text-center mb-2 font-medium">{error}</p>
          )}
          <Button
            className="w-full gap-2 min-h-[44px]"
            size="lg"
            disabled={!hasChanges || saving}
            onClick={handleSave}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
