"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IndianRupee,
  Plus,
  Download,
  TrendingUp,
  Wallet,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
  X,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { IllustrationPayments } from "@/components/illustrations";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  description: string | null;
  dueDate: string | null;
  paidAt: string | null;
  appointmentId: string | null;
  createdAt: string;
  client?: { firstName: string; lastName: string | null } | null;
}

interface ClientBalance {
  clientId: string;
  clientName: string;
  amount: number;
  count: number;
}

interface Summary {
  totalThisMonth: number;
  sessionsThisMonth: number;
  outstandingTotal: number;
  outstandingCount: number;
  overdueCount: number;
  topOutstanding: ClientBalance[];
  monthlyData: { month: string; revenue: number; sessions: number }[];
}

export default function PaymentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const initialFilter = searchParams.get("filter") as "all" | "pending" | "received" | null;
  const [filter, setFilter] = useState<"all" | "pending" | "received">(
    initialFilter && ["all", "pending", "received"].includes(initialFilter) ? initialFilter : "all"
  );
  const [markingId, setMarkingId] = useState<string | null>(null);

  // Sync filter to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter && filter !== "all") {
      params.set("filter", filter);
    } else {
      params.delete("filter");
    }
    const query = params.toString();
    router.replace(query ? `?${query}` : "/payments", { scroll: false });
  }, [filter]);

  const hasActiveFilters = filter !== "all";

  function clearFilters() {
    setFilter("all");
    router.replace("/payments", { scroll: false });
  }

  async function loadData() {
    try {
      const [paymentsRes, summaryRes, clientsRes] = await Promise.all([
        fetch("/api/payments"),
        fetch("/api/payments/summary"),
        fetch("/api/clients"),
      ]);

      if (!paymentsRes.ok || !summaryRes.ok || !clientsRes.ok) {
        throw new Error("Failed to load payment data");
      }

      const [paymentsData, summaryData, clientsData] = await Promise.all([
        paymentsRes.json(),
        summaryRes.json(),
        clientsRes.json(),
      ]);

      setPayments(paymentsData);
      setSummary(summaryData);
      setClients(clientsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function markAsReceived(paymentId: string, method: string) {
    setMarkingId(paymentId);
    try {
      const res = await fetch(`/api/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RECEIVED", method }),
      });
      if (res.ok) {
        await loadData();
      }
    } finally {
      setMarkingId(null);
    }
  }

  async function generateInvoice(clientId: string) {
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    });
    if (res.ok) {
      const invoice = await res.json();
      alert(`Invoice ${invoice.invoiceNumber} generated!`);
      await loadData();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to generate invoice");
    }
  }

  async function exportCSV() {
    const headers = "Date,Client,Amount,Method,Status,Due Date,Paid At\n";
    const rows = payments
      .map(
        (p) =>
          `${format(new Date(p.createdAt), "yyyy-MM-dd")},${p.client ? `${p.client.firstName} ${p.client.lastName || ""}` : "—"},${p.amount},${p.method},${p.status},${p.dueDate ? format(new Date(p.dueDate), "yyyy-MM-dd") : ""},${p.paidAt ? format(new Date(p.paidAt), "yyyy-MM-dd") : ""}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindstack-payments-${format(new Date(), "yyyy-MM")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredPayments = payments.filter((p) => {
    if (filter === "pending") return p.status === "PENDING" || p.status === "OVERDUE";
    if (filter === "received") return p.status === "RECEIVED";
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto page-enter">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="section-header-icon bg-gradient-to-br from-green-500 to-emerald-600">
              <Wallet size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-lg sm:text-2xl font-bold text-neutral-900">
                Payments
              </h1>
              <p className="text-neutral-500 text-xs">Track revenue & outstanding balances</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
        <div className="skeleton h-64 rounded-xl mb-6" />
        <div className="skeleton h-72 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto page-enter">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="section-header-icon bg-gradient-to-br from-green-500 to-emerald-600">
              <Wallet size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-lg sm:text-2xl font-bold text-neutral-900">
                Payments
              </h1>
              <p className="text-neutral-500 text-xs">Track revenue & outstanding balances</p>
            </div>
          </div>
        </div>
        <Card className="shadow-card">
          <CardContent className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={22} className="text-red-400" />
            </div>
            <p className="text-neutral-700 font-medium mb-1">Failed to load payments</p>
            <p className="text-sm text-neutral-500 mb-4">{error}</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setError(null);
                setLoading(true);
                loadData();
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
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="section-header-icon bg-gradient-to-br from-green-500 to-emerald-600">
            <Wallet size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-lg sm:text-2xl font-bold text-neutral-900">
              Payments
            </h1>
            <p className="text-neutral-500 text-xs">Track revenue & outstanding balances</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={exportCSV} size="sm" className="gap-1.5 text-xs sm:text-sm">
            <Download size={14} /> Export
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 text-xs sm:text-sm">
                <Plus size={14} /> Log Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <IndianRupee size={18} className="text-green-500" />
                  Log Payment Received
                </DialogTitle>
              </DialogHeader>
              <LogPaymentForm
                clients={clients}
                onSuccess={() => {
                  setDialogOpen(false);
                  loadData();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 stagger-children">
          <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-card card-lift card-press">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-md bg-green-500/10 flex items-center justify-center">
                  <IndianRupee size={14} className="text-green-600" />
                </div>
                <p className="text-[10px] sm:text-xs text-green-700 font-medium">This Month</p>
              </div>
              <p className="text-base sm:text-xl font-bold text-green-900">
                {formatINR(summary.totalThisMonth)}
              </p>
              <p className="text-[10px] sm:text-xs text-green-600 mt-0.5">
                {summary.sessionsThisMonth} sessions
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-50 shadow-card card-lift card-press">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-md bg-amber-500/10 flex items-center justify-center">
                  <Clock size={14} className="text-amber-600" />
                </div>
                <p className="text-[10px] sm:text-xs text-amber-700 font-medium">Outstanding</p>
              </div>
              <p className="text-base sm:text-xl font-bold text-amber-900">
                {formatINR(summary.outstandingTotal)}
              </p>
              <p className="text-[10px] sm:text-xs text-amber-600 mt-0.5">
                {summary.outstandingCount} pending
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-red-50 to-rose-50 shadow-card card-lift card-press">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-md bg-red-500/10 flex items-center justify-center">
                  <AlertCircle size={14} className="text-red-600" />
                </div>
                <p className="text-[10px] sm:text-xs text-red-700 font-medium">Overdue</p>
              </div>
              <p className="text-base sm:text-xl font-bold text-red-900">
                {summary.overdueCount}
              </p>
              <p className="text-[10px] sm:text-xs text-red-600 mt-0.5">
                need follow-up
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-card card-lift card-press">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-md bg-blue-500/10 flex items-center justify-center">
                  <BarChart3 size={14} className="text-blue-600" />
                </div>
                <p className="text-[10px] sm:text-xs text-blue-700 font-medium">Avg / Session</p>
              </div>
              <p className="text-base sm:text-xl font-bold text-blue-900">
                {summary.sessionsThisMonth > 0
                  ? formatINR(
                      Math.round(
                        summary.totalThisMonth / summary.sessionsThisMonth
                      )
                    )
                  : "—"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Outstanding by Client */}
      {summary && summary.topOutstanding.length > 0 && (
        <Card className="mb-6 shadow-card border border-amber-100/60 overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-amber-50/60 to-orange-50/40 border-b border-amber-100/50">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center">
                <AlertCircle size={14} className="text-amber-500" />
              </div>
              Outstanding by Client
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-100/80">
              {summary.topOutstanding.map((client) => (
                <div
                  key={client.clientId}
                  className="flex items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-amber-50/30 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-semibold text-amber-700 shrink-0">
                      {client.clientName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 group-hover:text-amber-900 transition-colors">
                        {client.clientName}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {client.count} unpaid session{client.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                      {formatINR(client.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 opacity-60 group-hover:opacity-100 transition-opacity"
                      onClick={() => generateInvoice(client.clientId!)}
                    >
                      <FileText size={12} className="mr-1" /> Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 items-center">
        {(["all", "pending", "received"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {f === "all" ? "All" : f === "pending" ? "Pending" : "Received"}
            {f === "pending" && summary?.outstandingCount
              ? ` (${summary.outstandingCount})`
              : ""}
          </button>
        ))}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1.5 text-neutral-500 hover:text-neutral-700 text-xs h-7 ml-1"
          >
            <X size={12} /> Clear filters
          </Button>
        )}
      </div>

      {/* Payments Table — Desktop */}
      <Card className="mb-6 shadow-card hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-gradient-to-r from-neutral-50 to-green-50/30">
                  <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">Client</th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">Amount</th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">Method</th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">Due</th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-neutral-100 last:border-0 hover:bg-green-50/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {format(new Date(payment.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900 font-medium">
                      {payment.client
                        ? `${payment.client.firstName} ${payment.client.lastName || ""}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-700">
                      {formatINR(payment.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-600">
                        {payment.method === "OTHER" && payment.status === "PENDING"
                          ? "—"
                          : payment.method}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500">
                      {payment.dueDate
                        ? format(new Date(payment.dueDate), "MMM d")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {(payment.status === "PENDING" || payment.status === "OVERDUE") && (
                        <MarkReceivedButton
                          paymentId={payment.id}
                          loading={markingId === payment.id}
                          onMark={markAsReceived}
                        />
                      )}
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <IllustrationPayments width={80} height={80} />
                        <p className="text-neutral-600 font-medium mt-4">
                          {filter === "all"
                            ? "No payments recorded yet"
                            : `No ${filter} payments`}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          {filter === "all"
                            ? "Payments are auto-created when sessions are completed"
                            : "Try a different filter"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payments Cards — Mobile */}
      <div className="md:hidden space-y-3 mb-6 stagger-children">
        {filteredPayments.length === 0 && !loading && (
          <Card className="shadow-card">
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center">
                <IllustrationPayments width={80} height={80} />
                <p className="text-neutral-600 font-medium mt-4">
                  {filter === "all"
                    ? "No payments recorded yet"
                    : `No ${filter} payments`}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Payments are auto-created when sessions are completed
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        {filteredPayments.map((payment) => (
          <Card key={payment.id} className="shadow-card card-press">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-900">
                  {payment.client
                    ? `${payment.client.firstName} ${payment.client.lastName || ""}`
                    : "—"}
                </span>
                <PaymentStatusBadge status={payment.status} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-green-700">
                  {formatINR(payment.amount)}
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-600">
                  {payment.method === "OTHER" && payment.status === "PENDING"
                    ? "Awaiting"
                    : payment.method}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-neutral-400">
                  {format(new Date(payment.createdAt), "MMM d, yyyy")}
                  {payment.dueDate && payment.status !== "RECEIVED" && (
                    <span className="ml-2 text-amber-600">
                      Due {format(new Date(payment.dueDate), "MMM d")}
                    </span>
                  )}
                </p>
                {(payment.status === "PENDING" || payment.status === "OVERDUE") && (
                  <MarkReceivedButton
                    paymentId={payment.id}
                    loading={markingId === payment.id}
                    onMark={markAsReceived}
                  />
                )}
              </div>
              {payment.description && (
                <p className="text-xs text-neutral-500 mt-1">{payment.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      {summary && summary.monthlyData.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <TrendingUp size={18} className="text-green-500" /> Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={summary.monthlyData} margin={{ left: -10, right: 4, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEA" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={50} />
                <Tooltip
                  formatter={(value: number) => [formatINR(value), "Revenue"]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e5e5" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="url(#revenueGradient)"
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#00979A" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: any; label: string }> = {
    RECEIVED: { variant: "active", label: "Received" },
    PENDING: { variant: "pending", label: "Pending" },
    OVERDUE: { variant: "error", label: "Overdue" },
    WAIVED: { variant: "secondary", label: "Waived" },
    REFUNDED: { variant: "secondary", label: "Refunded" },
    PARTIALLY_PAID: { variant: "pending", label: "Partial" },
  };
  const c = config[status] || { variant: "secondary", label: status };
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

function MarkReceivedButton({
  paymentId,
  loading,
  onMark,
}: {
  paymentId: string;
  loading: boolean;
  onMark: (id: string, method: string) => void;
}) {
  const [showMethods, setShowMethods] = useState(false);

  if (showMethods) {
    return (
      <div className="flex gap-1 flex-wrap">
        {["UPI", "CASH", "CARD", "BANK_TRANSFER"].map((m) => (
          <button
            key={m}
            onClick={() => {
              onMark(paymentId, m);
              setShowMethods(false);
            }}
            disabled={loading}
            className="px-2 py-1 text-[10px] rounded-md bg-green-50 text-green-700 hover:bg-green-100 font-medium transition-colors"
          >
            {m === "BANK_TRANSFER" ? "Bank" : m}
          </button>
        ))}
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-xs h-7 gap-1 text-green-700 hover:text-green-800 hover:bg-green-50"
      onClick={() => setShowMethods(true)}
      disabled={loading}
    >
      <CheckCircle2 size={12} />
      {loading ? "..." : "Received"}
    </Button>
  );
}

function LogPaymentForm({
  clients,
  onSuccess,
}: {
  clients: any[];
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Failed to log payment");
      setLoading(false);
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="clientId">Client</Label>
        <select
          id="clientId"
          name="clientId"
          className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm mt-1"
        >
          <option value="">Select client (optional)</option>
          {clients.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName || ""}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="amount">Amount (INR) *</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min={1}
          required
          className="mt-1"
          placeholder="e.g. 1500"
        />
      </div>
      <div>
        <Label htmlFor="method">Payment Method *</Label>
        <select
          id="method"
          name="method"
          required
          className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm mt-1"
        >
          <option value="UPI">UPI</option>
          <option value="CASH">Cash</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
          <option value="CARD">Card</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          className="mt-1"
          placeholder="e.g. Follow-up session"
        />
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging..." : "Log Payment"}
      </Button>
    </form>
  );
}
