"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import {
  Calendar,
  IndianRupee,
  Clock,
  Video,
  Search,
  ArrowRight,
  User,
  MapPin,
  Phone,
  CheckCircle2,
} from "lucide-react";

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
    slug: string | null;
    avatarUrl: string | null;
    city: string | null;
    specializations: string[];
  } | null;
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  description: string | null;
  sessionDate: string | null;
  createdAt: string;
}

interface HomeData {
  displayName: string;
  upcomingAppointments: Appointment[];
  recentPayments: Payment[];
  totalSessions: number;
}

export default function MyCare() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/client-dashboard/home")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-enter">
        <div className="skeleton h-8 w-48 rounded-lg mb-2" />
        <div className="skeleton h-4 w-36 rounded-lg mb-6" />
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-32 rounded-2xl mb-6" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-enter">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-neutral-500 mb-4">Something went wrong loading your dashboard.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPaid = data.recentPayments
    .filter((p) => p.status === "RECEIVED")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = data.recentPayments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  const nextSession = data.upcomingAppointments[0] || null;

  // Extract unique therapists from appointments
  const therapistMap = new Map<string, { name: string; city: string | null; slug: string | null; nextDate: string | null }>();
  for (const a of data.upcomingAppointments) {
    if (a.practitioner && a.practitioner.displayName) {
      const key = a.practitioner.displayName;
      if (!therapistMap.has(key)) {
        therapistMap.set(key, {
          name: a.practitioner.displayName,
          city: a.practitioner.city,
          slug: a.practitioner.slug,
          nextDate: a.scheduledAt,
        });
      }
    }
  }
  const therapists = Array.from(therapistMap.values());

  const modalityIcon = (m: string) => {
    if (m === "ONLINE") return <Video size={13} className="text-green-600" />;
    if (m === "PHONE") return <Phone size={13} className="text-amber-600" />;
    return <MapPin size={13} className="text-blue-600" />;
  };

  return (
    <div className="page-enter">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">
          Hi {data.displayName?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">Your wellness dashboard</p>
      </div>

      {/* Summary cards 2x2 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="card-lift card-press border-0 bg-gradient-to-br from-primary-50 to-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <Calendar size={16} className="text-primary-500" />
              </div>
            </div>
            <p className="font-heading text-xl font-bold text-neutral-900 tabular-nums">
              {data.upcomingAppointments.length}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wider mt-0.5 text-primary-600/70">
              Upcoming
            </p>
          </CardContent>
        </Card>

        <Card className="card-lift card-press border-0 bg-gradient-to-br from-blue-50 to-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <CheckCircle2 size={16} className="text-blue-500" />
              </div>
            </div>
            <p className="font-heading text-xl font-bold text-neutral-900 tabular-nums">
              {data.totalSessions}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wider mt-0.5 text-blue-600/70">
              Total Sessions
            </p>
          </CardContent>
        </Card>

        <Card className="card-lift card-press border-0 bg-gradient-to-br from-green-50 to-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center">
                <IndianRupee size={16} className="text-green-600" />
              </div>
            </div>
            <p className="font-heading text-lg font-bold text-neutral-900 tabular-nums">
              {formatINR(totalPaid)}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wider mt-0.5 text-green-600/70">
              Paid
            </p>
          </CardContent>
        </Card>

        <Card className="card-lift card-press border-0 bg-gradient-to-br from-amber-50 to-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <IndianRupee size={16} className="text-amber-600" />
              </div>
            </div>
            <p className="font-heading text-lg font-bold text-neutral-900 tabular-nums">
              {formatINR(totalPending)}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wider mt-0.5 text-amber-600/70">
              Pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next Session highlight */}
      {nextSession && (
        <Card className="mb-6 border-0 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 shadow-sm overflow-hidden relative">
          <div className="absolute top-[-30px] right-[-30px] w-[100px] h-[100px] rounded-full bg-white/10" />
          <CardContent className="p-5 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/75 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
              <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                Next Session
              </p>
            </div>
            <p className="font-heading text-lg font-bold text-white">
              {new Date(nextSession.scheduledAt).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <p className="text-sm text-primary-100 mt-1 flex items-center gap-1.5">
              <Clock size={13} />
              {new Date(nextSession.scheduledAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" · "}{nextSession.duration} min
              {nextSession.practitioner && (
                <> · with {nextSession.practitioner.displayName}</>
              )}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Badge className="bg-white/20 text-white border-0 text-xs gap-1">
                {modalityIcon(nextSession.modality)}
                {nextSession.modality.toLowerCase().replace("_", " ")}
              </Badge>
            </div>
            {nextSession.modality === "ONLINE" &&
              nextSession.status === "CONFIRMED" &&
              nextSession.meetingLink && (
                <a href={nextSession.meetingLink} target="_blank" rel="noopener noreferrer" className="block mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white text-primary-700 hover:bg-white/90 min-h-[44px] w-full gap-2"
                  >
                    <Video size={16} />
                    Join Session
                  </Button>
                </a>
              )}
          </CardContent>
        </Card>
      )}

      {/* Your Therapists */}
      <div className="mb-6">
        <h2 className="font-heading text-base font-semibold text-neutral-900 mb-3">
          Your Therapists
        </h2>
        {therapists.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <User size={32} className="text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">
                You haven&apos;t connected with a therapist yet.
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Find and book your first session below.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {therapists.map((t) => (
              <Link key={t.name} href={t.slug ? `/dr/${t.slug}` : "#"}>
                <Card className="card-lift card-press">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary-700">
                        {t.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-neutral-900 truncate">
                        {t.name}
                      </p>
                      {t.city && (
                        <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={11} /> {t.city}
                        </p>
                      )}
                      {t.nextDate && (
                        <p className="text-[11px] text-primary-600 font-medium mt-1">
                          Next:{" "}
                          {new Date(t.nextDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      )}
                    </div>
                    <ArrowRight size={16} className="text-neutral-300 shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Find a Therapist CTA */}
      <Link href="/find-therapist" className="block">
        <Button className="w-full gap-2 min-h-[44px]" size="lg">
          <Search size={18} />
          Find a Therapist
        </Button>
      </Link>
    </div>
  );
}
