"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Clock,
  XCircle,
  Activity,
  AlertCircle,
} from "lucide-react";

interface Analytics {
  sessionsThisWeek: number;
  sessionsLastWeek: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  noShowRate: number;
  clientRetentionRate: number;
  supervisionHoursThisMonth: number;
  topConcerns: { concern: string; count: number }[];
}

type RangeKey = "week" | "month" | "3months" | "year" | "custom";

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "3months", label: "Last 3 Months" },
  { key: "year", label: "This Year" },
  { key: "custom", label: "Custom" },
];

function getDateRange(key: RangeKey): { from: string; to: string } {
  const now = new Date();
  const to = now.toISOString().split("T")[0];

  switch (key) {
    case "week": {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1; // Monday start
      const start = new Date(now);
      start.setDate(now.getDate() - diff);
      return { from: start.toISOString().split("T")[0], to };
    }
    case "month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: start.toISOString().split("T")[0], to };
    }
    case "3months": {
      const start = new Date(now);
      start.setMonth(start.getMonth() - 3);
      return { from: start.toISOString().split("T")[0], to };
    }
    case "year": {
      const start = new Date(now.getFullYear(), 0, 1);
      return { from: start.toISOString().split("T")[0], to };
    }
    default:
      return { from: "", to: "" };
  }
}

const CONCERN_COLORS = [
  "from-primary-400 to-primary-500",
  "from-blue-400 to-blue-500",
  "from-purple-400 to-purple-500",
  "from-amber-400 to-amber-500",
  "from-pink-400 to-pink-500",
  "from-green-400 to-green-500",
];

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>("month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const fetchAnalytics = useCallback(async (from: string, to: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = from && to ? `?from=${from}&to=${to}` : "";
      const res = await fetch(`/api/analytics${params}`);
      if (!res.ok) {
        throw new Error("Failed to load analytics data");
      }
      const d = await res.json();
      setData(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (range === "custom") return; // Don't auto-fetch for custom until user sets dates
    const { from, to } = getDateRange(range);
    fetchAnalytics(from, to);
  }, [range, fetchAnalytics]);

  function handleCustomApply() {
    if (customFrom && customTo) {
      fetchAnalytics(customFrom, customTo);
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto page-enter">
        <div className="flex items-center gap-2 mb-6">
          <div className="section-header-icon bg-gradient-to-br from-indigo-500 to-purple-600">
            <Activity size={18} className="text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">
            Analytics
          </h1>
        </div>
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
        <div className="skeleton h-64 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto page-enter">
        <div className="flex items-center gap-2 mb-6">
          <div className="section-header-icon bg-gradient-to-br from-indigo-500 to-purple-600">
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-neutral-900">
              Analytics
            </h1>
            <p className="text-neutral-500 text-xs">Track your practice performance</p>
          </div>
        </div>
        <Card className="shadow-card">
          <CardContent className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={22} className="text-red-400" />
            </div>
            <p className="text-neutral-700 font-medium mb-1">Failed to load analytics</p>
            <p className="text-sm text-neutral-500 mb-4">{error}</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const { from, to } = range === "custom"
                  ? { from: customFrom, to: customTo }
                  : getDateRange(range);
                fetchAnalytics(from, to);
              }}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const sessionsTrend = data.sessionsThisWeek - data.sessionsLastWeek;
  const revenueTrend = data.revenueThisMonth - data.revenueLastMonth;

  return (
    <div className="max-w-5xl mx-auto page-enter">
      <div className="flex items-center gap-2 mb-6">
        <div className="section-header-icon bg-gradient-to-br from-indigo-500 to-purple-600">
          <Activity size={18} className="text-white" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">
            Analytics
          </h1>
          <p className="text-neutral-500 text-xs">Track your practice performance</p>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                setRange(opt.key);
                if (opt.key !== "custom") {
                  setCustomFrom("");
                  setCustomTo("");
                }
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
                range === opt.key
                  ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-300 hover:bg-primary-50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {range === "custom" && (
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-end gap-3 mt-3">
            <div className="w-full sm:w-auto">
              <label className="text-xs text-neutral-500 font-medium mb-1 block">From</label>
              <Input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="w-full sm:w-40"
              />
            </div>
            <div className="w-full sm:w-auto">
              <label className="text-xs text-neutral-500 font-medium mb-1 block">To</label>
              <Input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="w-full sm:w-40"
              />
            </div>
            <Button
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleCustomApply}
              disabled={!customFrom || !customTo}
            >
              Apply
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Sessions This Week"
          value={String(data.sessionsThisWeek)}
          trend={sessionsTrend}
          trendLabel="vs last week"
          icon={Calendar}
          gradient="from-primary-50 to-teal-50"
          iconBg="bg-primary-500/10"
          iconColor="text-primary-600"
        />
        <StatCard
          title="Revenue This Month"
          value={formatINR(data.revenueThisMonth)}
          trend={revenueTrend}
          trendLabel="vs last month"
          icon={TrendingUp}
          formatTrend={(v) => formatINR(Math.abs(v))}
          gradient="from-green-50 to-emerald-50"
          iconBg="bg-green-500/10"
          iconColor="text-green-600"
        />
        <StatCard
          title="No-Show Rate"
          value={`${data.noShowRate.toFixed(1)}%`}
          icon={XCircle}
          gradient="from-red-50 to-pink-50"
          iconBg="bg-red-500/10"
          iconColor="text-red-600"
        />
        <StatCard
          title="Client Retention"
          value={`${data.clientRetentionRate.toFixed(0)}%`}
          icon={Users}
          subtitle="Active in last 30 days"
          gradient="from-blue-50 to-indigo-50"
          iconBg="bg-blue-500/10"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Supervision Hours"
          value={`${data.supervisionHoursThisMonth.toFixed(1)}h`}
          subtitle="This month"
          icon={Clock}
          gradient="from-purple-50 to-violet-50"
          iconBg="bg-purple-500/10"
          iconColor="text-purple-600"
        />
      </div>

      {/* Top Concerns */}
      {data.topConcerns.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 size={18} className="text-indigo-500" />
              Top Presenting Concerns
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="space-y-4">
              {data.topConcerns.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs font-mono text-neutral-400 w-4 shrink-0">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center justify-between mb-1.5 gap-2 flex-col sm:flex-row">
                      <span className="text-sm font-medium text-neutral-700 truncate">
                        {item.concern}
                      </span>
                      <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                        {item.count} clients
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2.5">
                      <div
                        className={`bg-gradient-to-r ${CONCERN_COLORS[idx % CONCERN_COLORS.length]} h-2.5 rounded-full transition-all duration-500`}
                        style={{
                          width: `${(item.count / data.topConcerns[0].count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  subtitle,
  formatTrend,
  gradient,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  icon: any;
  subtitle?: string;
  formatTrend?: (v: number) => string;
  gradient?: string;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <Card className={`border-0 bg-gradient-to-br ${gradient || "from-neutral-50 to-neutral-100"} shadow-card card-lift card-press`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-7 h-7 rounded-md ${iconBg || "bg-neutral-100"} flex items-center justify-center`}>
            <Icon size={14} className={iconColor || "text-neutral-400"} />
          </div>
          <span className="text-xs text-neutral-500 font-medium">{title}</span>
        </div>
        <p className="stat-number text-neutral-900">{value}</p>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {trend >= 0 ? (
              <TrendingUp size={12} className="text-green-500" />
            ) : (
              <TrendingDown size={12} className="text-red-500" />
            )}
            <span
              className={`text-xs ${trend >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {trend >= 0 ? "+" : ""}
              {formatTrend ? formatTrend(trend) : trend} {trendLabel}
            </span>
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
