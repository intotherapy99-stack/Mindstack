"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  Edit2,
  X,
  Check,
  RefreshCw,
  User,
  Share2,
  Copy,
  CheckCheck,
  Pill,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils";
import { BillingTracker } from "@/components/dashboard/billing-tracker";

// --- Types ---

interface ClientData {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  presentingConcern: string | null;
  referralSource: string | null;
  status: string;
  createdAt: string;
  lastSession: string | null;
  totalSessions: number;
  totalNotes: number;
  totalPayments: number;
  totalPaid: number;
  outstandingBalance: number;
}

interface SessionItem {
  id: string;
  scheduledAt: string;
  duration: number;
  sessionType: string;
  modality: string;
  status: string;
  fee: number | null;
  noShow: boolean;
}

interface NoteItem {
  id: string;
  template: string;
  content: any;
  tags: string[];
  createdAt: string;
  appointment: { scheduledAt: string } | null;
}

interface PaymentItem {
  id: string;
  amount: number;
  method: string;
  sessionDate: string | null;
  description: string | null;
  status: string;
  createdAt: string;
}

interface PrescriptionItem {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  isVisibleToClient: boolean;
  createdAt: string;
}

// --- Constants ---

const statusColor: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  ON_HOLD: "bg-amber-50 text-amber-700 border-amber-200",
  INACTIVE: "bg-neutral-50 text-neutral-500 border-neutral-200",
  DISCHARGED: "bg-blue-50 text-blue-600 border-blue-200",
};

const sessionStatusColor: Record<string, string> = {
  CONFIRMED: "bg-green-50 text-green-700 border-green-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  COMPLETED: "bg-blue-50 text-blue-600 border-blue-200",
  CANCELLED: "bg-neutral-50 text-neutral-500 border-neutral-200",
  NO_SHOW: "bg-red-50 text-red-600 border-red-200",
};

const paymentStatusColor: Record<string, string> = {
  RECEIVED: "bg-green-50 text-green-700 border-green-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  REFUNDED: "bg-neutral-50 text-neutral-500 border-neutral-200",
};

const statusOptions = ["ACTIVE", "ON_HOLD", "INACTIVE", "DISCHARGED"];

// --- Helpers ---

function formatLabel(value: string): string {
  return value.toLowerCase().replace(/_/g, " ");
}

function getNotePreview(content: any): string {
  if (typeof content === "string") return content.slice(0, 120);
  if (content && typeof content === "object") {
    // SOAP format
    if (content.subjective) return content.subjective.slice(0, 120);
    // DAP format
    if (content.data) return content.data.slice(0, 120);
    // Free text
    if (content.text) return content.text.slice(0, 120);
    // Fallback: stringify first value
    const first = Object.values(content)[0];
    if (typeof first === "string") return first.slice(0, 120);
  }
  return "";
}

// --- Component ---

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<ClientData | null>(null);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [paymentsLoaded, setPaymentsLoaded] = useState(false);
  const [prescriptionsLoaded, setPrescriptionsLoaded] = useState(false);

  // Prescription dialog state
  const [rxDialogOpen, setRxDialogOpen] = useState(false);
  const [rxEditing, setRxEditing] = useState<PrescriptionItem | null>(null);
  const [rxSaving, setRxSaving] = useState(false);
  const [rxForm, setRxForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
    fileName: "",
    fileType: "PDF",
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [portalLink, setPortalLink] = useState<string | null>(null);
  const [portalCopied, setPortalCopied] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    presentingConcern: "",
    referralSource: "",
    status: "",
  });

  // Fetch client data
  const fetchClient = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/clients/${clientId}`);
      if (!res.ok) throw new Error("Failed to load client");
      const data = await res.json();
      setClient(data);
      setEditForm({
        firstName: data.firstName,
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        presentingConcern: data.presentingConcern || "",
        referralSource: data.referralSource || "",
        status: data.status,
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  // Fetch sessions
  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch(`/api/clients/${clientId}/sessions`);
      if (!res.ok) return;
      setSessions(await res.json());
    } catch {
      // silent
    } finally {
      setSessionsLoaded(true);
    }
  }, [clientId]);

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch(`/api/clients/${clientId}/notes`);
      if (!res.ok) return;
      setNotes(await res.json());
    } catch {
      // silent
    } finally {
      setNotesLoaded(true);
    }
  }, [clientId]);

  // Fetch payments
  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch(`/api/clients/${clientId}/payments`);
      if (!res.ok) return;
      setPayments(await res.json());
    } catch {
      // silent
    } finally {
      setPaymentsLoaded(true);
    }
  }, [clientId]);

  // Fetch prescriptions
  const fetchPrescriptions = useCallback(async () => {
    try {
      const res = await fetch(`/api/prescriptions?clientId=${clientId}`);
      if (!res.ok) return;
      setPrescriptions(await res.json());
    } catch {
      // silent
    } finally {
      setPrescriptionsLoaded(true);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  // Lazy-load tab data
  useEffect(() => {
    if (activeTab === "sessions" && !sessionsLoaded) fetchSessions();
    if (activeTab === "notes" && !notesLoaded) fetchNotes();
    if (activeTab === "payments" && !paymentsLoaded) fetchPayments();
    if (activeTab === "prescriptions" && !prescriptionsLoaded) fetchPrescriptions();
  }, [activeTab, sessionsLoaded, notesLoaded, paymentsLoaded, prescriptionsLoaded, fetchSessions, fetchNotes, fetchPayments, fetchPrescriptions]);

  // Save edits
  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setClient((prev) =>
        prev
          ? {
              ...prev,
              ...updated,
            }
          : prev
      );
      setEditing(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  // Prescription helpers
  function openAddRx() {
    setRxEditing(null);
    setRxForm({ title: "", description: "", fileUrl: "", fileName: "", fileType: "PDF" });
    setRxDialogOpen(true);
  }

  function openEditRx(rx: PrescriptionItem) {
    setRxEditing(rx);
    setRxForm({
      title: rx.title,
      description: rx.description || "",
      fileUrl: rx.fileUrl,
      fileName: rx.fileName,
      fileType: rx.fileType,
    });
    setRxDialogOpen(true);
  }

  async function handleRxSave() {
    if (!rxForm.title || !rxForm.fileUrl || !rxForm.fileName) {
      toast.error("Please fill in title, file URL, and file name");
      return;
    }
    setRxSaving(true);
    try {
      if (rxEditing) {
        const res = await fetch(`/api/prescriptions/${rxEditing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rxForm),
        });
        if (!res.ok) throw new Error("Failed to update prescription");
        const updated = await res.json();
        setPrescriptions((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
        toast.success("Prescription updated");
      } else {
        const res = await fetch("/api/prescriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...rxForm, clientId }),
        });
        if (!res.ok) throw new Error("Failed to create prescription");
        const created = await res.json();
        setPrescriptions((prev) => [created, ...prev]);
        toast.success("Prescription added");
      }
      setRxDialogOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setRxSaving(false);
    }
  }

  async function handleRxDelete(id: string) {
    if (!confirm("Delete this prescription? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/prescriptions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete prescription");
      setPrescriptions((prev) => prev.filter((p) => p.id !== id));
      toast.success("Prescription deleted");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function handleRxToggleVisibility(rx: PrescriptionItem) {
    try {
      const res = await fetch(`/api/prescriptions/${rx.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisibleToClient: !rx.isVisibleToClient }),
      });
      if (!res.ok) throw new Error("Failed to update visibility");
      const updated = await res.json();
      setPrescriptions((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
      toast.success(updated.isVisibleToClient ? "Visible to client" : "Hidden from client");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  // Generate portal link
  async function generatePortalLink() {
    setPortalLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/portal-link`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to generate link");
      const data = await res.json();
      const fullUrl = `${window.location.origin}${data.url}`;
      setPortalLink(fullUrl);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPortalLoading(false);
    }
  }

  function copyPortalLink() {
    if (portalLink) {
      navigator.clipboard.writeText(portalLink);
      setPortalCopied(true);
      setTimeout(() => setPortalCopied(false), 2000);
    }
  }

  // --- Loading state ---
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto page-enter">
        <div className="flex items-center gap-3 mb-6">
          <div className="skeleton w-8 h-8 rounded-lg" />
          <div className="skeleton h-7 w-48 rounded-lg" />
        </div>
        <div className="skeleton h-10 w-80 rounded-md mb-4" />
        <div className="space-y-4">
          <div className="skeleton h-40 rounded-xl" />
          <div className="skeleton h-32 rounded-xl" />
          <div className="skeleton h-24 rounded-xl" />
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error && !client) {
    return (
      <div className="max-w-5xl mx-auto page-enter">
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 mb-6 min-h-[44px]"
        >
          <ArrowLeft size={16} />
          Back to Clients
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
          <p className="font-semibold mb-2">Something went wrong</p>
          <p>{error}</p>
          <Button
            onClick={fetchClient}
            variant="outline"
            size="sm"
            className="mt-3 gap-2"
          >
            <RefreshCw size={14} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!client) return null;

  const initials = `${client.firstName[0]}${client.lastName?.[0] || ""}`;

  return (
    <div className="max-w-5xl mx-auto page-enter">
      {/* Back button */}
      <Link
        href="/clients"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 mb-4 min-h-[44px]"
      >
        <ArrowLeft size={16} />
        Back to Clients
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white font-bold text-sm">{initials}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl md:text-2xl font-bold text-neutral-900">
                {client.firstName} {client.lastName || ""}
              </h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusColor[client.status] || "bg-neutral-50 text-neutral-600 border-neutral-200"}`}
              >
                {formatLabel(client.status)}
              </span>
            </div>
            {client.presentingConcern && (
              <p className="text-neutral-500 text-xs mt-0.5 max-w-md truncate">
                {client.presentingConcern}
              </p>
            )}
          </div>
        </div>
        {/* Share Portal Link */}
        <div className="ml-auto flex items-center gap-2">
          {portalLink ? (
            <div className="flex items-center gap-2 bg-primary-50 rounded-lg px-3 py-2">
              <input
                readOnly
                value={portalLink}
                className="text-xs bg-transparent text-primary-700 w-40 sm:w-56 truncate outline-none"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={copyPortalLink}
                className="h-8 w-8 p-0"
              >
                {portalCopied ? (
                  <CheckCheck size={14} className="text-green-600" />
                ) : (
                  <Copy size={14} />
                )}
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={generatePortalLink}
              disabled={portalLoading}
              className="gap-1.5"
            >
              <Share2 size={14} />
              <span className="hidden sm:inline">Share Portal</span>
            </Button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview" className="min-h-[44px]">
            Overview
          </TabsTrigger>
          <TabsTrigger value="sessions" className="min-h-[44px]">
            Sessions
          </TabsTrigger>
          <TabsTrigger value="notes" className="min-h-[44px]">
            Notes
          </TabsTrigger>
          <TabsTrigger value="payments" className="min-h-[44px]">
            Payments
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="min-h-[44px] gap-1.5">
            <Pill size={14} />
            Prescriptions
          </TabsTrigger>
        </TabsList>

        {/* ===== OVERVIEW TAB ===== */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          {/* Key stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Calendar size={16} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Total Sessions</p>
                    <p className="text-lg font-bold text-neutral-900 tabular-nums">
                      {client.totalSessions}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Clock size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Last Session</p>
                    <p className="text-sm font-semibold text-neutral-900">
                      {client.lastSession
                        ? format(new Date(client.lastSession), "MMM d, yyyy")
                        : "None yet"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent-50 flex items-center justify-center">
                    <CreditCard size={16} className="text-accent-500" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Outstanding</p>
                    <p className="text-lg font-bold tabular-nums">
                      {client.outstandingBalance > 0 ? (
                        <span className="text-accent-600">
                          {formatINR(client.outstandingBalance)}
                        </span>
                      ) : (
                        <span className="text-green-600">
                          {formatINR(0)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing Tracker */}
          <BillingTracker clientId={clientId} />

          {/* Client info card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Client Information</CardTitle>
                {!editing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                    className="gap-1.5 min-h-[44px]"
                  >
                    <Edit2 size={14} />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(false);
                        setEditForm({
                          firstName: client.firstName,
                          lastName: client.lastName || "",
                          email: client.email || "",
                          phone: client.phone || "",
                          presentingConcern: client.presentingConcern || "",
                          referralSource: client.referralSource || "",
                          status: client.status,
                        });
                      }}
                      className="gap-1.5 min-h-[44px]"
                    >
                      <X size={14} />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={saving}
                      className="gap-1.5 min-h-[44px]"
                    >
                      <Check size={14} />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="edit-firstName">First Name</Label>
                      <Input
                        id="edit-firstName"
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            firstName: e.target.value,
                          }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-lastName">Last Name</Label>
                      <Input
                        id="edit-lastName"
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            lastName: e.target.value,
                          }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            email: e.target.value,
                          }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-phone">Phone</Label>
                      <Input
                        id="edit-phone"
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            phone: e.target.value,
                          }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <select
                      id="edit-status"
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          status: e.target.value,
                        }))
                      }
                      className="mt-1.5 flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {formatLabel(s)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="edit-concern">Presenting Concern</Label>
                    <Textarea
                      id="edit-concern"
                      rows={3}
                      value={editForm.presentingConcern}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          presentingConcern: e.target.value,
                        }))
                      }
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-referral">Referral Source</Label>
                    <Input
                      id="edit-referral"
                      value={editForm.referralSource}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          referralSource: e.target.value,
                        }))
                      }
                      className="mt-1.5"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Contact info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <Mail size={14} className="text-neutral-500" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400">Email</p>
                        <p className="text-sm text-neutral-900">
                          {client.email || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <Phone size={14} className="text-neutral-500" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400">Phone</p>
                        <p className="text-sm text-neutral-900">
                          {client.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Presenting concern */}
                  {client.presentingConcern && (
                    <div>
                      <p className="text-xs text-neutral-400 mb-1">
                        Presenting Concern
                      </p>
                      <p className="text-sm text-neutral-700 leading-relaxed">
                        {client.presentingConcern}
                      </p>
                    </div>
                  )}

                  {/* Referral & Member since */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                    <div>
                      <p className="text-xs text-neutral-400">
                        Referral Source
                      </p>
                      <p className="text-sm text-neutral-700 mt-0.5">
                        {client.referralSource || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400">Client Since</p>
                      <p className="text-sm text-neutral-700 mt-0.5">
                        {format(new Date(client.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== SESSIONS TAB ===== */}
        <TabsContent value="sessions" className="mt-4">
          {!sessionsLoaded ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-[72px] rounded-xl" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon bg-gradient-to-br from-primary-50 to-accent-50">
                <Calendar size={32} className="text-primary-400" />
              </div>
              <p className="text-neutral-700 font-semibold text-lg">
                No sessions yet
              </p>
              <p className="text-sm text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
                Sessions with this client will appear here once scheduled.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <Card key={s.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                          <Calendar size={16} className="text-primary-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-900">
                            {format(
                              new Date(s.scheduledAt),
                              "MMM d, yyyy"
                            )}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                            <span>
                              {format(new Date(s.scheduledAt), "h:mm a")}
                            </span>
                            <span>&middot;</span>
                            <span>{s.duration} min</span>
                            <span>&middot;</span>
                            <span>{formatLabel(s.modality)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${sessionStatusColor[s.status] || "bg-neutral-50 text-neutral-600 border-neutral-200"}`}
                        >
                          {formatLabel(s.status)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ===== NOTES TAB ===== */}
        <TabsContent value="notes" className="mt-4">
          {!notesLoaded ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-[72px] rounded-xl" />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon bg-gradient-to-br from-primary-50 to-accent-50">
                <FileText size={32} className="text-primary-400" />
              </div>
              <p className="text-neutral-700 font-semibold text-lg">
                No notes yet
              </p>
              <p className="text-sm text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
                Session notes for this client will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((n) => {
                const preview = getNotePreview(n.content);
                const noteDate = n.appointment?.scheduledAt || n.createdAt;
                return (
                  <Card key={n.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText size={16} className="text-blue-500" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-neutral-900">
                                {format(new Date(noteDate), "MMM d, yyyy")}
                              </p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-neutral-50 text-neutral-600 border-neutral-200">
                                {n.template === "FREE_TEXT"
                                  ? "FREE"
                                  : n.template}
                              </span>
                            </div>
                            {preview && (
                              <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                                {preview}
                                {preview.length >= 120 && "..."}
                              </p>
                            )}
                            {n.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {n.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-primary-50 text-primary-600"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ===== PAYMENTS TAB ===== */}
        <TabsContent value="payments" className="mt-4 space-y-4">
          {!paymentsLoaded ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-[72px] rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {/* Summary cards */}
              {payments.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-neutral-500">Total Paid</p>
                      <p className="text-lg font-bold text-green-600 tabular-nums mt-0.5">
                        {formatINR(client.totalPaid)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-neutral-500">Outstanding</p>
                      <p className="text-lg font-bold tabular-nums mt-0.5">
                        {client.outstandingBalance > 0 ? (
                          <span className="text-accent-600">
                            {formatINR(client.outstandingBalance)}
                          </span>
                        ) : (
                          <span className="text-green-600">
                            {formatINR(0)}
                          </span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {payments.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon bg-gradient-to-br from-primary-50 to-accent-50">
                    <CreditCard size={32} className="text-primary-400" />
                  </div>
                  <p className="text-neutral-700 font-semibold text-lg">
                    No payments yet
                  </p>
                  <p className="text-sm text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
                    Payments for this client will appear here once recorded.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {payments.map((p) => (
                    <Card key={p.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                              <CreditCard
                                size={16}
                                className="text-green-500"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-neutral-900 tabular-nums">
                                {formatINR(p.amount)}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                                <span>
                                  {format(
                                    new Date(p.createdAt),
                                    "MMM d, yyyy"
                                  )}
                                </span>
                                <span>&middot;</span>
                                <span>{formatLabel(p.method)}</span>
                                {p.description && (
                                  <>
                                    <span>&middot;</span>
                                    <span className="truncate max-w-[150px]">
                                      {p.description}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 ${paymentStatusColor[p.status] || "bg-neutral-50 text-neutral-600 border-neutral-200"}`}
                          >
                            {formatLabel(p.status)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* ===== PRESCRIPTIONS TAB ===== */}
        <TabsContent value="prescriptions" className="mt-4 space-y-4">
          {!prescriptionsLoaded ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-[72px] rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                  {prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""}
                </p>
                <Button size="sm" onClick={openAddRx} className="gap-1.5 min-h-[44px]">
                  <Plus size={14} />
                  Add Prescription
                </Button>
              </div>

              {prescriptions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon bg-gradient-to-br from-primary-50 to-accent-50">
                    <Pill size={32} className="text-primary-400" />
                  </div>
                  <p className="text-neutral-700 font-semibold text-lg">
                    No prescriptions yet
                  </p>
                  <p className="text-sm text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
                    Upload prescriptions for this client. They can optionally be shared with the client.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {prescriptions.map((rx) => (
                    <Card key={rx.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
                              <Pill size={16} className="text-purple-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-neutral-900">
                                {rx.title}
                              </p>
                              {rx.description && (
                                <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2 leading-relaxed">
                                  {rx.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                                <span>{format(new Date(rx.createdAt), "MMM d, yyyy")}</span>
                                <span>&middot;</span>
                                <span className="inline-flex items-center gap-1">
                                  <FileText size={10} />
                                  {rx.fileName}
                                </span>
                                <span>&middot;</span>
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 text-neutral-600">
                                  {rx.fileType}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1.5" title={rx.isVisibleToClient ? "Visible to client" : "Hidden from client"}>
                              {rx.isVisibleToClient ? (
                                <Eye size={13} className="text-green-500" />
                              ) : (
                                <EyeOff size={13} className="text-neutral-400" />
                              )}
                              <Switch
                                checked={rx.isVisibleToClient}
                                onCheckedChange={() => handleRxToggleVisibility(rx)}
                              />
                            </div>
                            <a
                              href={rx.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                              title="Open file"
                            >
                              <ExternalLink size={13} className="text-neutral-500" />
                            </a>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditRx(rx)}
                              className="h-8 w-8 p-0"
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRxDelete(rx.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Add / Edit Prescription Dialog */}
          <Dialog open={rxDialogOpen} onOpenChange={setRxDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{rxEditing ? "Edit Prescription" : "Add Prescription"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="rx-title">Title *</Label>
                  <Input
                    id="rx-title"
                    placeholder="e.g. Sertraline 50mg"
                    value={rxForm.title}
                    onChange={(e) => setRxForm((f) => ({ ...f, title: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="rx-description">Description</Label>
                  <Textarea
                    id="rx-description"
                    rows={2}
                    placeholder="Optional notes about this prescription"
                    value={rxForm.description}
                    onChange={(e) => setRxForm((f) => ({ ...f, description: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="rx-fileUrl">File URL *</Label>
                  <Input
                    id="rx-fileUrl"
                    placeholder="https://..."
                    value={rxForm.fileUrl}
                    onChange={(e) => setRxForm((f) => ({ ...f, fileUrl: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="rx-fileName">File Name *</Label>
                    <Input
                      id="rx-fileName"
                      placeholder="prescription.pdf"
                      value={rxForm.fileName}
                      onChange={(e) => setRxForm((f) => ({ ...f, fileName: e.target.value }))}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rx-fileType">File Type</Label>
                    <select
                      id="rx-fileType"
                      value={rxForm.fileType}
                      onChange={(e) => setRxForm((f) => ({ ...f, fileType: e.target.value }))}
                      className="mt-1.5 flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
                    >
                      <option value="PDF">PDF</option>
                      <option value="IMAGE">Image</option>
                      <option value="DOCUMENT">Document</option>
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRxDialogOpen(false)} className="min-h-[44px]">
                  Cancel
                </Button>
                <Button onClick={handleRxSave} disabled={rxSaving} className="min-h-[44px]">
                  {rxSaving ? "Saving..." : rxEditing ? "Update" : "Add Prescription"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
