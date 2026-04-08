"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Phone,
  CalendarX,
} from "lucide-react";
import Link from "next/link";

interface Appointment {
  id: string;
  scheduledAt: string;
  duration: number;
  sessionType: string;
  modality: string;
  status: string;
  meetingLink: string | null;
  fee: number | null;
  practitioner: {
    displayName: string;
    avatarUrl: string | null;
    slug: string | null;
  } | null;
}

function modalityConfig(modality: string) {
  switch (modality) {
    case "ONLINE":
      return { label: "Online", className: "bg-green-100 text-green-700", icon: Video };
    case "IN_PERSON":
      return { label: "In-person", className: "bg-blue-100 text-blue-700", icon: MapPin };
    case "PHONE":
      return { label: "Phone", className: "bg-amber-100 text-amber-700", icon: Phone };
    default:
      return { label: modality, className: "bg-neutral-100 text-neutral-600", icon: Calendar };
  }
}

function statusVariant(status: string) {
  switch (status.toUpperCase()) {
    case "CONFIRMED": return "active" as const;
    case "COMPLETED": return "verified" as const;
    case "CANCELLED": return "error" as const;
    case "PENDING": return "pending" as const;
    default: return "unverified" as const;
  }
}

function SessionCard({ apt }: { apt: Appointment }) {
  const mod = modalityConfig(apt.modality);
  const ModIcon = mod.icon;
  const dt = new Date(apt.scheduledAt);
  const showJoin = apt.modality === "ONLINE" && apt.status === "CONFIRMED" && apt.meetingLink;

  return (
    <Card className="card-lift card-press">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary-700">
              {apt.practitioner?.displayName?.charAt(0) || "?"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-neutral-900 truncate">
              {apt.practitioner?.displayName || "Unknown"}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </span>
              <span>{apt.duration} min</span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${mod.className}`}>
                <ModIcon size={10} />
                {mod.label}
              </span>
              <Badge variant={statusVariant(apt.status)} className="text-[10px]">
                {apt.status.toLowerCase().replace("_", " ")}
              </Badge>
            </div>

            {showJoin && (
              <a href={apt.meetingLink!} target="_blank" rel="noopener noreferrer" className="block mt-3">
                <Button size="sm" className="gap-1.5 min-h-[44px] w-full">
                  <Video size={14} />
                  Join Session
                </Button>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ type }: { type: "upcoming" | "past" }) {
  return (
    <Card>
      <CardContent className="p-10 text-center">
        <CalendarX size={40} className="text-neutral-300 mx-auto mb-3" />
        <p className="font-medium text-neutral-700 mb-1">
          {type === "upcoming" ? "No upcoming sessions" : "No past sessions"}
        </p>
        <p className="text-sm text-neutral-500">
          {type === "upcoming"
            ? "Book a session with a therapist to get started."
            : "Your completed sessions will appear here."}
        </p>
        {type === "upcoming" && (
          <Link href="/find-therapist" className="block mt-4">
            <Button size="sm">Find a Therapist</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

export default function MySessions() {
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [past, setPast] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/client-dashboard/sessions?status=upcoming").then((r) => {
        if (!r.ok) throw new Error("Failed to load sessions");
        return r.json();
      }),
      fetch("/api/client-dashboard/sessions?status=past").then((r) => {
        if (!r.ok) throw new Error("Failed to load sessions");
        return r.json();
      }),
    ])
      .then(([u, p]) => {
        setUpcoming(u.appointments ?? []);
        setPast(p.appointments ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-enter">
        <div className="skeleton h-7 w-40 rounded-lg mb-4" />
        <div className="skeleton h-10 w-full rounded-lg mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-enter">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-neutral-500 mb-4">Could not load your sessions.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <h1 className="font-heading text-xl font-bold text-neutral-900 mb-4">
        My Sessions
      </h1>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="upcoming" className="flex-1">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex-1">
            Past ({past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <EmptyState type="upcoming" />
          ) : (
            <div className="space-y-3 mt-3">
              {upcoming.map((a) => (
                <SessionCard key={a.id} apt={a} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {past.length === 0 ? (
            <EmptyState type="past" />
          ) : (
            <div className="space-y-3 mt-3">
              {past.map((a) => (
                <SessionCard key={a.id} apt={a} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
