"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatINR } from "@/lib/utils";
import { Calendar, CheckCircle2, Clock, Loader2 } from "lucide-react";

interface Props {
  practitionerSlug: string;
  sessionDuration: number;
  sessionFee: number | null;
}

function formatTime12h(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function BookingForm({ practitionerSlug, sessionDuration, sessionFee }: Props) {
  const [step, setStep] = useState<"form" | "confirmation">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState("");
  const [customTime, setCustomTime] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    sessionType: "FOLLOW_UP",
    concern: "",
  });

  // Fetch available slots when date changes
  useEffect(() => {
    if (!formData.date) {
      setSlots([]);
      setSlotsMessage("");
      return;
    }

    setSlotsLoading(true);
    setSlotsMessage("");
    setSlots([]);
    setFormData((prev) => ({ ...prev, time: "" }));

    fetch(`/api/appointments/slots/${practitionerSlug}?date=${formData.date}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.slots && data.slots.length > 0) {
          setSlots(data.slots);
          setSlotsMessage("");
        } else {
          setSlots([]);
          setSlotsMessage(data.message || "No available slots for this date");
        }
      })
      .catch(() => {
        setSlotsMessage("Failed to load slots. Please try again.");
      })
      .finally(() => setSlotsLoading(false));
  }, [formData.date, practitionerSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.time) {
      setError("Please select a time slot");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/appointments/book/${practitionerSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStep("confirmation");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    }
    setLoading(false);
  }

  if (step === "confirmation") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h3 className="font-heading text-xl font-bold text-neutral-900 mb-2">
          Booking Request Sent!
        </h3>
        <p className="text-neutral-500 text-sm max-w-xs mx-auto">
          The practitioner will confirm your session. You&apos;ll receive a
          confirmation via WhatsApp and email.
        </p>
        <div className="mt-4 bg-primary-50 rounded-xl p-3 text-sm text-primary-700 inline-block">
          <Calendar size={14} className="inline mr-1.5" />
          {new Date(formData.date).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
          {" at "}
          {formatTime12h(formData.time)}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Your Name *</Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1"
          placeholder="Your full name"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      {/* Date picker */}
      <div>
        <Label htmlFor="date">Select Date *</Label>
        <Input
          id="date"
          type="date"
          required
          min={new Date().toISOString().split("T")[0]}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="mt-1"
        />
      </div>

      {/* Time slot picker */}
      {formData.date && (
        <div>
          <Label className="flex items-center gap-1.5 mb-2">
            <Clock size={14} />
            Available Slots
            {slotsLoading && <Loader2 size={14} className="animate-spin text-primary-500" />}
          </Label>

          {slotsLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton h-10 rounded-lg" />
              ))}
            </div>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, time });
                    setError("");
                  }}
                  className={`rounded-lg border text-sm font-medium py-2.5 px-2 transition-all min-h-[44px] ${
                    formData.time === time
                      ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                      : "bg-white text-neutral-700 border-neutral-200 hover:border-primary-300 hover:bg-primary-50"
                  }`}
                >
                  {formatTime12h(time)}
                </button>
              ))}
            </div>
          ) : slotsMessage ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl p-3 text-center">
              {slotsMessage}
            </div>
          ) : null}

          {/* Custom time toggle */}
          {!customTime ? (
            <button
              type="button"
              onClick={() => setCustomTime(true)}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium mt-2 underline underline-offset-2"
            >
              None of these work? Request a different time
            </button>
          ) : (
            <div className="mt-2 bg-neutral-50 rounded-xl p-3">
              <p className="text-xs text-neutral-500 mb-2">
                Request a custom time (practitioner will confirm):
              </p>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  setCustomTime(false);
                  setFormData({ ...formData, time: "" });
                }}
                className="text-xs text-neutral-400 hover:text-neutral-600 mt-2 underline underline-offset-2"
              >
                Back to available slots
              </button>
            </div>
          )}
        </div>
      )}

      <div>
        <Label>Session Type</Label>
        <Select
          value={formData.sessionType}
          onValueChange={(v) => setFormData({ ...formData, sessionType: v })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INITIAL_CONSULTATION">Initial Consultation</SelectItem>
            <SelectItem value="FOLLOW_UP">Follow-up</SelectItem>
            <SelectItem value="CRISIS">Crisis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="concern">What would you like to discuss? (optional)</Label>
        <Textarea
          id="concern"
          value={formData.concern}
          onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
          className="mt-1"
          rows={3}
          placeholder="Briefly describe your concern..."
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
          {error}
        </div>
      )}

      {sessionFee && (
        <div className="bg-neutral-50 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-neutral-600">Session fee</span>
          <span className="font-semibold text-neutral-900">
            {formatINR(sessionFee)} / {sessionDuration} min
          </span>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading || !formData.time}
      >
        <Calendar size={16} className="mr-2" />
        {loading ? "Submitting..." : formData.time ? `Book at ${formatTime12h(formData.time)}` : "Select a time slot"}
      </Button>

      <p className="text-[11px] text-neutral-400 text-center">
        Your information is private and only shared with the practitioner.
        MindStack complies with the DPDP Act.
      </p>
    </form>
  );
}
