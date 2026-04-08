"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import {
  IndianRupee,
  Calendar,
  CreditCard,
  Wallet,
  Receipt,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  description: string | null;
  sessionDate: string | null;
  dueDate: string | null;
  paidAt: string | null;
  isOverdue: boolean;
  createdAt: string;
  practitionerName: string | null;
  sessionType: string | null;
  invoiceUrl: string | null;
}

interface Summary {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  pendingCount: number;
}

function statusVariant(status: string, isOverdue?: boolean) {
  if (status === "RECEIVED") return "verified" as const;
  if (status === "OVERDUE" || isOverdue) return "error" as const;
  return "pending" as const;
}

function statusLabel(status: string, isOverdue?: boolean) {
  if (status === "RECEIVED") return "Paid";
  if (status === "OVERDUE" || isOverdue) return "Overdue";
  if (status === "WAIVED") return "Waived";
  return "Pending";
}

function methodIcon(method: string) {
  switch (method?.toUpperCase()) {
    case "UPI":
    case "RAZORPAY":
    case "CARD":
      return CreditCard;
    case "CASH":
      return Wallet;
    default:
      return CreditCard;
  }
}

export default function MyPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "paid">("all");

  useEffect(() => {
    fetch("/api/client-dashboard/payments")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load payments");
        return res.json();
      })
      .then((data) => {
        setPayments(data.payments ?? []);
        setSummary(data.summary ?? null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredPayments = payments.filter((p) => {
    if (filter === "pending")
      return p.status === "PENDING" || p.status === "OVERDUE";
    if (filter === "paid") return p.status === "RECEIVED";
    return true;
  });

  if (loading) {
    return (
      <div className="page-enter">
        <div className="skeleton h-7 w-44 rounded-lg mb-4" />
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="skeleton h-24 rounded-2xl" />
          <div className="skeleton h-24 rounded-2xl" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
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
            <p className="text-neutral-500 mb-4">Could not load payment history.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <h1 className="font-heading text-xl font-bold text-neutral-900 mb-4">
        My Payments
      </h1>

      {/* Summary */}
      {summary && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card className="card-lift border-0 bg-gradient-to-br from-green-50 to-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <IndianRupee size={16} className="text-green-600" />
                  </div>
                </div>
                <p className="font-heading text-xl font-bold text-neutral-900">
                  {formatINR(summary.totalPaid)}
                </p>
                <p className="text-[11px] font-semibold text-green-600/70 uppercase tracking-wider mt-0.5">
                  Total Paid
                </p>
              </CardContent>
            </Card>

            <Card className="card-lift border-0 bg-gradient-to-br from-amber-50 to-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Clock size={16} className="text-amber-600" />
                  </div>
                </div>
                <p className="font-heading text-xl font-bold text-neutral-900">
                  {formatINR(summary.totalPending)}
                </p>
                <p className="text-[11px] font-semibold text-amber-600/70 uppercase tracking-wider mt-0.5">
                  Outstanding
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Overdue alert */}
          {summary.totalOverdue > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
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
        </>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(["all", "pending", "paid"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {f === "all"
              ? "All"
              : f === "pending"
                ? `Pending${summary?.pendingCount ? ` (${summary.pendingCount})` : ""}`
                : "Paid"}
          </button>
        ))}
      </div>

      {/* Payment list */}
      {filteredPayments.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <Receipt size={40} className="text-neutral-300 mx-auto mb-3" />
            <p className="font-medium text-neutral-700 mb-1">
              {filter === "all"
                ? "No payments yet"
                : `No ${filter} payments`}
            </p>
            <p className="text-sm text-neutral-500">
              {filter === "all"
                ? "Your payment history will appear here after your first session."
                : "Try a different filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPayments.map((p) => {
            const MethodIcon = methodIcon(p.method);
            const isOverdue = p.isOverdue || p.status === "OVERDUE";
            return (
              <Card key={p.id} className="card-lift card-press">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        p.status === "RECEIVED"
                          ? "bg-green-100"
                          : isOverdue
                            ? "bg-red-100"
                            : "bg-amber-100"
                      }`}
                    >
                      <IndianRupee
                        size={16}
                        className={
                          p.status === "RECEIVED"
                            ? "text-green-600"
                            : isOverdue
                              ? "text-red-600"
                              : "text-amber-600"
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-heading text-base font-bold text-neutral-900">
                          {formatINR(p.amount)}
                        </p>
                        <Badge
                          variant={statusVariant(p.status, p.isOverdue)}
                          className="text-[10px]"
                        >
                          {statusLabel(p.status, p.isOverdue)}
                        </Badge>
                      </div>
                      {p.description && (
                        <p className="text-xs text-neutral-600 mt-0.5 truncate">
                          {p.description}
                        </p>
                      )}
                      {p.practitionerName && (
                        <p className="text-xs text-neutral-500 mt-0.5 truncate">
                          {p.practitionerName}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(p.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {p.status === "RECEIVED" && (
                          <span className="flex items-center gap-1">
                            <MethodIcon size={10} />
                            {p.method}
                          </span>
                        )}
                        {p.dueDate &&
                          p.status !== "RECEIVED" &&
                          p.status !== "WAIVED" && (
                            <span
                              className={`flex items-center gap-1 ${
                                isOverdue ? "text-red-500" : "text-amber-500"
                              }`}
                            >
                              <Clock size={10} />
                              Due{" "}
                              {new Date(p.dueDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          )}
                      </div>
                      {p.invoiceUrl && (
                        <a
                          href={p.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors"
                        >
                          <FileText size={12} />
                          View Invoice
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
