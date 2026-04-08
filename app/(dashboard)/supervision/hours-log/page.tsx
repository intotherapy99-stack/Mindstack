"use client";

import React, { useState, useEffect, useMemo } from "react";
import { format, startOfQuarter, endOfQuarter } from "date-fns";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  GraduationCap,
  Filter,
  Hourglass,
} from "lucide-react";
import { IllustrationSupervision } from "@/components/illustrations";

interface SupervisionSession {
  id: string;
  scheduledAt: string;
  duration: number;
  modality: "ONLINE" | "IN_PERSON" | "HYBRID";
  status: string;
  sessionType: string;
  supervisor: {
    profile: {
      displayName: string;
      slug: string;
      avatarUrl: string | null;
    } | null;
  };
  supervisee: {
    profile: {
      displayName: string;
      slug: string;
      avatarUrl: string | null;
    } | null;
  };
}

const REQUIRED_QUARTERLY_HOURS = 12;

function getQuarterLabel(date: Date): string {
  const q = Math.ceil((date.getMonth() + 1) / 3);
  return `Q${q} ${date.getFullYear()}`;
}

export default function SupervisionHoursLogPage() {
  const [sessions, setSessions] = useState<SupervisionSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);

      const res = await fetch(`/api/supervision/sessions?${params}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch sessions (${res.status})`);
      }
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  // Recalculate when filters change
  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, dateFrom, dateTo]);

  const now = new Date();
  const quarterStart = startOfQuarter(now);
  const quarterEnd = endOfQuarter(now);

  const quarterlyCompleted = useMemo(() => {
    return sessions
      .filter((s) => {
        const d = new Date(s.scheduledAt);
        return (
          s.status === "COMPLETED" && d >= quarterStart && d <= quarterEnd
        );
      })
      .reduce((sum, s) => sum + s.duration, 0);
  }, [sessions, quarterStart, quarterEnd]);

  const totalHoursCompleted = quarterlyCompleted / 60;
  const progressPercent = Math.min(
    (totalHoursCompleted / REQUIRED_QUARTERLY_HOURS) * 100,
    100
  );
  const hoursRemaining = Math.max(
    REQUIRED_QUARTERLY_HOURS - totalHoursCompleted,
    0
  );

  function getStatusBadgeVariant(
    status: string
  ): "active" | "pending" | "error" | "default" {
    switch (status) {
      case "COMPLETED":
        return "active";
      case "CONFIRMED":
      case "PENDING":
        return "pending";
      case "CANCELLED":
      case "NO_SHOW":
        return "error";
      default:
        return "default";
    }
  }

  function getModalityLabel(modality: string) {
    switch (modality) {
      case "ONLINE":
        return "Online";
      case "IN_PERSON":
        return "In-Person";
      case "HYBRID":
        return "Hybrid";
      default:
        return modality;
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto page-enter">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/supervision"
            className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-neutral-500" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="section-header-icon bg-gradient-to-br from-purple-500 to-purple-600">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-neutral-900">
                Supervision Hours Log
              </h1>
              <p className="text-neutral-500 text-xs">
                Track your supervision hours & progress
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
        <div className="skeleton h-72 rounded-xl" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-5xl mx-auto page-enter">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/supervision"
            className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-neutral-500" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="section-header-icon bg-gradient-to-br from-purple-500 to-purple-600">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-neutral-900">
                Supervision Hours Log
              </h1>
              <p className="text-neutral-500 text-xs">
                Track your supervision hours & progress
              </p>
            </div>
          </div>
        </div>
        <Card className="shadow-card">
          <CardContent className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={22} className="text-red-400" />
            </div>
            <p className="text-neutral-700 font-medium mb-1">
              Failed to load supervision sessions
            </p>
            <p className="text-sm text-neutral-500 mb-4">{error}</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setError(null);
                fetchSessions();
              }}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto page-enter">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/supervision"
          className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-neutral-500" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="section-header-icon bg-gradient-to-br from-purple-500 to-purple-600">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-neutral-900">
              Supervision Hours Log
            </h1>
            <p className="text-neutral-500 text-xs">
              Track your supervision hours & progress
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-card card-lift card-press">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md bg-purple-500/10 flex items-center justify-center">
                <Clock size={14} className="text-purple-600" />
              </div>
              <p className="text-xs text-purple-700 font-medium">Completed</p>
            </div>
            <p className="stat-number text-purple-900">
              {totalHoursCompleted.toFixed(1)}h
            </p>
            <p className="text-xs text-purple-600 mt-0.5">
              {getQuarterLabel(now)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-card card-lift card-press">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md bg-blue-500/10 flex items-center justify-center">
                <Target size={14} className="text-blue-600" />
              </div>
              <p className="text-xs text-blue-700 font-medium">Required</p>
            </div>
            <p className="stat-number text-blue-900">
              {REQUIRED_QUARTERLY_HOURS}h
            </p>
            <p className="text-xs text-blue-600 mt-0.5">Per quarter (recommended)</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-emerald-50 to-green-50 shadow-card card-lift card-press">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp size={14} className="text-emerald-600" />
              </div>
              <p className="text-xs text-emerald-700 font-medium">Progress</p>
            </div>
            <p className="stat-number text-emerald-900">
              {progressPercent.toFixed(0)}%
            </p>
            {/* Progress bar */}
            <div className="mt-2 h-2 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-50 shadow-card card-lift card-press">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md bg-amber-500/10 flex items-center justify-center">
                <Hourglass size={14} className="text-amber-600" />
              </div>
              <p className="text-xs text-amber-700 font-medium">Remaining</p>
            </div>
            <p className="stat-number text-amber-900">
              {hoursRemaining.toFixed(1)}h
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Until{" "}
              {format(quarterEnd, "MMM d")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="secondary"
          size="sm"
          className="gap-1.5 min-h-[44px]"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={14} />
          Filters
        </Button>
      </div>

      {showFilters && (
        <Card className="mb-6 border-purple-100">
          <CardContent className="p-4">
            {/* Mobile: stacked */}
            <div className="sm:hidden space-y-3">
              <div>
                <Label className="text-xs mb-1.5 block">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="NO_SHOW">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">From</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-11"
                />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">To</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-11"
                />
              </div>
              {(statusFilter || dateFrom || dateTo) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-purple-600 min-h-[44px]"
                  onClick={() => {
                    setStatusFilter("");
                    setDateFrom("");
                    setDateTo("");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>

            {/* Desktop: grid */}
            <div className="hidden sm:grid sm:grid-cols-4 gap-4 items-end">
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="NO_SHOW">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">From</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">To</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                {(statusFilter || dateFrom || dateTo) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-purple-600"
                    onClick={() => {
                      setStatusFilter("");
                      setDateFrom("");
                      setDateTo("");
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions Table -- Desktop */}
      <Card className="mb-6 shadow-card hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-gradient-to-r from-neutral-50 to-purple-50/30">
                  <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">
                    Supervisor
                  </th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">
                    Duration
                  </th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">
                    Modality
                  </th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-neutral-100 last:border-0 hover:bg-purple-50/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {format(new Date(session.scheduledAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900 font-medium">
                      {session.supervisor?.profile?.displayName ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-purple-700">
                      {session.duration} min
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-600">
                        {getModalityLabel(session.modality)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(session.status)}>
                        {session.status.toLowerCase().replace("_", " ")}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {sessions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <IllustrationSupervision width={80} height={80} />
                        <p className="text-neutral-600 font-medium mt-4">
                          No supervision sessions found
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          Book your first supervision session to start logging
                          hours
                        </p>
                        <Link href="/supervision">
                          <Button
                            variant="supervision"
                            size="sm"
                            className="mt-4"
                          >
                            Find a Supervisor
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Cards -- Mobile */}
      <div className="md:hidden space-y-3 mb-6">
        {sessions.length === 0 && !loading && (
          <Card className="shadow-card">
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center">
                <IllustrationSupervision width={80} height={80} />
                <p className="text-neutral-600 font-medium mt-4">
                  No supervision sessions found
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Book your first supervision session to start logging hours
                </p>
                <Link href="/supervision">
                  <Button variant="supervision" size="sm" className="mt-4">
                    Find a Supervisor
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
        {sessions.map((session) => (
          <Card key={session.id} className="shadow-card card-press">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-900">
                  {session.supervisor?.profile?.displayName ?? "—"}
                </span>
                <Badge variant={getStatusBadgeVariant(session.status)}>
                  {session.status.toLowerCase().replace("_", " ")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-purple-700">
                  {session.duration} min
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-600">
                  {getModalityLabel(session.modality)}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                {format(new Date(session.scheduledAt), "MMM d, yyyy")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
