"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  CreditCard,
  Video,
  MapPin,
  Phone,
  ArrowRight,
  Heart,
  CheckCircle2,
  AlertCircle,
  Wallet,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";

interface PortalData {
  client: { firstName: string; lastName: string | null };
  practitioner: {
    name: string;
    avatar: string | null;
    slug: string | null;
    city: string | null;
    fee: number | null;
    duration: number | null;
    specializations: string[];
  };
  appointments: Array<{
    id: string;
    scheduledAt: string;
    duration: number;
    type: string;
    modality: string;
    status: string;
    meetingLink: string | null;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    method: string;
    status: string;
    description: string | null;
    date: string;
    dueDate: string | null;
    isOverdue: boolean;
  }>;
  summary: {
    totalSessions: number;
    upcomingSessions: number;
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
  };
}

export default function ClientPortalPage({
  params,
}: {
  params: { token: string };
}) {
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/client-portal?token=${params.token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid or expired link");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="skeleton h-12 rounded-xl mb-6" />
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
          <div className="skeleton h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-2">
              Link Not Valid
            </h2>
            <p className="text-neutral-500 text-sm">
              {error || "This portal link is invalid or has expired."}
              <br />
              Please contact your therapist for a new link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { client, practitioner, appointments, payments, summary } = data;
  const now = new Date();
  const upcoming = appointments.filter(
    (a) => a.status === "CONFIRMED" && new Date(a.scheduledAt) > now
  );
  const past = appointments.filter(
    (a) => a.status !== "CONFIRMED" || new Date(a.scheduledAt) <= now
  );

  const modalityIcon = (m: string) => {
    switch (m) {
      case "ONLINE": return <Video size={14} className="text-green-600" />;
      case "PHONE": return <Phone size={14} className="text-amber-600" />;
      default: return <MapPin size={14} className="text-blue-600" />;
    }
  };

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = {
      CONFIRMED: "bg-green-50 text-green-700 border-green-200",
      COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
      CANCELLED: "bg-red-50 text-red-700 border-red-200",
      PENDING: "bg-amber-50 text-amber-700 border-amber-200",
      NO_SHOW: "bg-neutral-100 text-neutral-500 border-neutral-200",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[s] || colors.PENDING}`}>
        {s.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-neutral-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xs">M</span>
            </div>
            <span className="font-heading font-bold text-sm text-neutral-900">
              MindStack
            </span>
          </div>
          <span className="text-xs text-neutral-400">Client Portal</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 page-enter">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-neutral-900">
            Hi {client.firstName} 👋
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Here&apos;s your session overview with{" "}
            <span className="font-medium text-neutral-700">
              {practitioner.name}
            </span>
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="card-lift border-0 bg-gradient-to-br from-primary-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays size={16} className="text-primary-500" />
                <span className="text-xs text-neutral-500">Upcoming</span>
              </div>
              <p className="text-2xl font-bold text-neutral-900 tabular-nums">
                {summary.upcomingSessions}
              </p>
              <p className="text-xs text-neutral-400">sessions</p>
            </CardContent>
          </Card>

          <Card className="card-lift border-0 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} className="text-blue-500" />
                <span className="text-xs text-neutral-500">Total</span>
              </div>
              <p className="text-2xl font-bold text-neutral-900 tabular-nums">
                {summary.totalSessions}
              </p>
              <p className="text-xs text-neutral-400">sessions</p>
            </CardContent>
          </Card>

          <Card className="card-lift border-0 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={16} className="text-green-500" />
                <span className="text-xs text-neutral-500">Paid</span>
              </div>
              <p className="text-lg font-bold text-neutral-900 tabular-nums">
                {formatINR(summary.totalPaid)}
              </p>
            </CardContent>
          </Card>

          <Card className="card-lift border-0 bg-gradient-to-br from-amber-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={16} className="text-amber-500" />
                <span className="text-xs text-neutral-500">Outstanding</span>
              </div>
              <p className="text-lg font-bold text-neutral-900 tabular-nums">
                {formatINR(summary.totalPending)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Overdue alert */}
        {summary.totalOverdue > 0 && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
            <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">
                {formatINR(summary.totalOverdue)} overdue
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                Please clear your outstanding balance to continue uninterrupted sessions.
              </p>
            </div>
          </div>
        )}

        {/* Next Appointment Highlight */}
        {upcoming.length > 0 && (
          <Card className="mb-6 border-primary-200 bg-gradient-to-r from-primary-50 to-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500" />
                </span>
                <span className="text-xs font-medium text-primary-700 uppercase tracking-wide">
                  Next Session
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-neutral-900">
                    {new Date(upcoming[0].scheduledAt).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <p className="text-sm text-neutral-500 flex items-center gap-1.5 mt-0.5">
                    <Clock size={13} />
                    {new Date(upcoming[0].scheduledAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" · "}{upcoming[0].duration} min
                    <span className="mx-1">·</span>
                    {modalityIcon(upcoming[0].modality)}
                    <span className="capitalize text-xs">
                      {upcoming[0].modality.toLowerCase().replace("_", " ")}
                    </span>
                  </p>
                </div>
                {upcoming[0].meetingLink && (
                  <a href={upcoming[0].meetingLink} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="gap-1.5">
                      <Video size={14} /> Join
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="sessions">
          <TabsList className="bg-white border border-neutral-200 p-1 w-full overflow-x-auto flex-nowrap">
            <TabsTrigger value="sessions" className="flex-1 min-h-[44px]">
              Sessions
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex-1 min-h-[44px]">
              Payments
            </TabsTrigger>
            <TabsTrigger value="therapist" className="flex-1 min-h-[44px]">
              Therapist
            </TabsTrigger>
          </TabsList>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="mt-4 space-y-3">
            {upcoming.length > 0 && (
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
                  Upcoming
                </p>
                {upcoming.map((appt) => (
                  <Card key={appt.id} className="mb-2 card-press">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <Calendar size={18} className="text-primary-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900">
                          {new Date(appt.scheduledAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-neutral-500 flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(appt.scheduledAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" · "}{appt.duration}m
                          <span className="mx-0.5">·</span>
                          {modalityIcon(appt.modality)}
                        </p>
                      </div>
                      {statusBadge(appt.status)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {past.length > 0 && (
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
                  Past Sessions
                </p>
                {past.map((appt) => (
                  <Card key={appt.id} className="mb-2 opacity-75">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                        <Calendar size={18} className="text-neutral-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-700">
                          {new Date(appt.scheduledAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-neutral-400 flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(appt.scheduledAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" · "}{appt.duration}m
                        </p>
                      </div>
                      {statusBadge(appt.status)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {appointments.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar size={40} className="mx-auto text-neutral-300 mb-3" />
                  <p className="text-neutral-500 text-sm">
                    No sessions yet. Your therapist will schedule your first session.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="mt-4 space-y-3">
            {payments.length > 0 ? (
              payments.map((p) => {
                const isOverdue = p.isOverdue || p.status === "OVERDUE";
                return (
                  <Card key={p.id} className="card-press">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          p.status === "RECEIVED"
                            ? "bg-green-50"
                            : isOverdue
                              ? "bg-red-50"
                              : "bg-amber-50"
                        }`}
                      >
                        <CreditCard
                          size={18}
                          className={
                            p.status === "RECEIVED"
                              ? "text-green-500"
                              : isOverdue
                                ? "text-red-500"
                                : "text-amber-500"
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900">
                          {formatINR(p.amount)}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {new Date(p.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                          {p.description && ` · ${p.description}`}
                        </p>
                        {p.dueDate && p.status !== "RECEIVED" && (
                          <p
                            className={`text-[11px] mt-0.5 flex items-center gap-1 ${
                              isOverdue ? "text-red-500" : "text-amber-500"
                            }`}
                          >
                            <Clock size={10} />
                            Due{" "}
                            {new Date(p.dueDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            p.status === "RECEIVED"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : isOverdue
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {p.status === "RECEIVED"
                            ? "Paid"
                            : isOverdue
                              ? "Overdue"
                              : "Pending"}
                        </span>
                        {p.status === "RECEIVED" && (
                          <span className="text-[10px] text-neutral-400 capitalize">
                            {p.method.toLowerCase().replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CreditCard size={40} className="mx-auto text-neutral-300 mb-3" />
                  <p className="text-neutral-500 text-sm">No payment records yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Therapist Tab */}
          <TabsContent value="therapist" className="mt-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                    {practitioner.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-neutral-900">
                      {practitioner.name}
                    </h3>
                    {practitioner.city && (
                      <p className="text-sm text-neutral-500 flex items-center gap-1">
                        <MapPin size={12} /> {practitioner.city}
                      </p>
                    )}
                  </div>
                </div>

                {practitioner.specializations.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-neutral-400 mb-2">
                      Specializations
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {practitioner.specializations.map((s) => (
                        <Badge key={s} variant="default">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100">
                  {practitioner.fee && (
                    <div>
                      <p className="text-xs text-neutral-400">Session Fee</p>
                      <p className="text-sm font-semibold text-neutral-900">
                        {formatINR(practitioner.fee)}
                      </p>
                    </div>
                  )}
                  {practitioner.duration && (
                    <div>
                      <p className="text-xs text-neutral-400">Duration</p>
                      <p className="text-sm font-semibold text-neutral-900">
                        {practitioner.duration} minutes
                      </p>
                    </div>
                  )}
                </div>

                {practitioner.slug && (
                  <Link href={`/dr/${practitioner.slug}`}>
                    <Button variant="outline" className="w-full mt-4 gap-2">
                      View Full Profile <ArrowRight size={14} />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <div className="flex items-center justify-center gap-1 text-xs text-neutral-400">
            <Heart size={12} className="text-red-400" />
            Powered by MindStack
          </div>
          <p className="text-[10px] text-neutral-300 mt-1">
            Your data is encrypted and protected under the DPDP Act
          </p>
        </div>
      </div>
    </div>
  );
}
