"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Settings2,
  X,
  Calendar,
  CreditCard,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

interface BillingData {
  sessionFee: number;
  sessionsPerMonth: number | null;
  completedSessions: number;
  confirmedUpcoming: number;
  totalOwed: number;
  totalPaid: number;
  totalPending: number;
  balanceDue: number;
  thisMonth: {
    sessions: number;
    expected: number | null;
    owed: number;
    paid: number;
    balance: number;
  };
  recentPayments: Array<{
    id: string;
    amount: number;
    method: string;
    status: string;
    date: string;
    description: string | null;
  }>;
}

interface Props {
  clientId: string;
}

export function BillingTracker({ clientId }: Props) {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [fee, setFee] = useState("");
  const [sessions, setSessions] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/clients/${clientId}/billing`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setFee(d.sessionFee?.toString() || "");
        setSessions(d.sessionsPerMonth?.toString() || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [clientId]);

  async function saveBillingSettings() {
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/billing`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionFee: fee ? parseInt(fee) : null,
          sessionsPerMonth: sessions ? parseInt(sessions) : null,
        }),
      });
      if (res.ok) {
        // Refresh data
        const fresh = await fetch(`/api/clients/${clientId}/billing`).then((r) => r.json());
        setData(fresh);
        setShowSettings(false);
      }
    } catch {
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="skeleton h-32 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const balanceColor =
    data.balanceDue > 0
      ? "text-red-600"
      : data.balanceDue === 0
      ? "text-green-600"
      : "text-blue-600";

  const balanceLabel =
    data.balanceDue > 0
      ? "Balance Due"
      : data.balanceDue === 0
      ? "Fully Paid"
      : "Overpaid";

  const progressPercent =
    data.thisMonth.expected && data.thisMonth.expected > 0
      ? Math.min((data.thisMonth.sessions / data.thisMonth.expected) * 100, 100)
      : null;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <IndianRupee size={15} className="text-primary-500" />
          Payment Tracker
        </CardTitle>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
        >
          {showSettings ? <X size={14} /> : <Settings2 size={14} />}
        </button>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Settings panel */}
        {showSettings && (
          <div className="bg-neutral-50 rounded-xl p-4 space-y-3 border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              Billing Settings
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Session Fee (₹)</Label>
                <Input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="e.g. 2000"
                  className="mt-1 h-10"
                />
              </div>
              <div>
                <Label className="text-xs">Sessions / Month</Label>
                <Input
                  type="number"
                  value={sessions}
                  onChange={(e) => setSessions(e.target.value)}
                  placeholder="e.g. 4"
                  className="mt-1 h-10"
                />
              </div>
            </div>
            <Button
              size="sm"
              onClick={saveBillingSettings}
              disabled={saving}
              className="w-full"
            >
              {saving ? "Saving..." : "Save Billing Settings"}
            </Button>
          </div>
        )}

        {/* Balance overview */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <CheckCircle2 size={16} className="text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-green-700 tabular-nums">
              {formatINR(data.totalPaid)}
            </p>
            <p className="text-[10px] text-green-600 font-medium">Paid</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <Clock size={16} className="text-amber-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-amber-700 tabular-nums">
              {formatINR(data.totalOwed)}
            </p>
            <p className="text-[10px] text-amber-600 font-medium">
              Owed ({data.completedSessions} sessions)
            </p>
          </div>
          <div className={`rounded-xl p-3 text-center ${data.balanceDue > 0 ? "bg-red-50" : "bg-blue-50"}`}>
            {data.balanceDue > 0 ? (
              <AlertTriangle size={16} className="text-red-500 mx-auto mb-1" />
            ) : (
              <TrendingUp size={16} className="text-blue-500 mx-auto mb-1" />
            )}
            <p className={`text-lg font-bold tabular-nums ${balanceColor}`}>
              {data.balanceDue > 0
                ? formatINR(data.balanceDue)
                : data.balanceDue === 0
                ? "₹0"
                : formatINR(Math.abs(data.balanceDue))}
            </p>
            <p className={`text-[10px] font-medium ${balanceColor}`}>
              {balanceLabel}
            </p>
          </div>
        </div>

        {/* This month progress */}
        {data.thisMonth.expected && (
          <div className="bg-neutral-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-neutral-600 flex items-center gap-1.5">
                <Calendar size={12} />
                This Month
              </p>
              <span className="text-xs text-neutral-500">
                {data.thisMonth.sessions}/{data.thisMonth.expected} sessions
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-500">
                Owed: <span className="font-semibold text-neutral-700">{formatINR(data.thisMonth.owed)}</span>
              </span>
              <span className="text-neutral-500">
                Paid: <span className="font-semibold text-green-600">{formatINR(data.thisMonth.paid)}</span>
              </span>
              {data.thisMonth.balance > 0 && (
                <span className="text-red-500 font-semibold">
                  Due: {formatINR(data.thisMonth.balance)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Fee info */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1 border-t border-neutral-100">
          <span>
            Fee: <span className="font-semibold text-neutral-700">{formatINR(data.sessionFee)}</span>/session
          </span>
          {data.confirmedUpcoming > 0 && (
            <Badge variant="default" className="text-[10px]">
              {data.confirmedUpcoming} upcoming
            </Badge>
          )}
        </div>

        {/* Recent payments */}
        {data.recentPayments.length > 0 && (
          <div>
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
              Recent Payments
            </p>
            <div className="space-y-1.5">
              {data.recentPayments.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-1.5 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard size={12} className="text-neutral-400" />
                    <span className="text-neutral-600">
                      {new Date(p.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className="text-neutral-400 capitalize">
                      {p.method.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                  <span
                    className={`font-semibold tabular-nums ${
                      p.status === "RECEIVED" ? "text-green-600" : "text-amber-600"
                    }`}
                  >
                    {formatINR(p.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
