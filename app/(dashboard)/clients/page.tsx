"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Users, UserPlus, ChevronRight, X } from "lucide-react";
import { IllustrationEmptyClients } from "@/components/illustrations";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

interface Client {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  presentingConcern: string | null;
  lastSession: string | null;
  totalSessions: number;
  completedSessions: number;
  totalPaid: number;
  totalOwed: number;
  balanceDue: number;
  outstandingBalance: number;
  sessionFee: number;
}

export default function ClientsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [dialogOpen, setDialogOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync search to URL with 300ms debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set("q", search);
      } else {
        params.delete("q");
      }
      const query = params.toString();
      router.replace(query ? `?${query}` : "/clients", { scroll: false });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const hasActiveFilters = search.length > 0;

  function clearFilters() {
    setSearch("");
    router.replace("/clients", { scroll: false });
  }

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error("Failed to load clients");
      const data = await res.json();
      setClients(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    const name = `${c.firstName} ${c.lastName || ""}`.toLowerCase();
    return (
      name.includes(q) ||
      (c.presentingConcern && c.presentingConcern.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q))
    );
  });

  const activeCount = clients.filter((c) => c.status === "ACTIVE").length;

  const statusColor: Record<string, string> = {
    ACTIVE: "bg-green-50 text-green-700 border-green-200",
    ON_HOLD: "bg-amber-50 text-amber-700 border-amber-200",
    INACTIVE: "bg-neutral-50 text-neutral-500 border-neutral-200",
    DISCHARGED: "bg-blue-50 text-blue-600 border-blue-200",
  };

  return (
    <div className="max-w-5xl mx-auto page-enter">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3.5">
          <div className="section-header-icon bg-gradient-to-br from-primary-500 to-primary-600 shadow-md shadow-primary-500/20">
            <Users size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
              Clients
            </h1>
            <p className="text-neutral-500 text-xs mt-0.5">
              <span className="font-medium text-neutral-600">{clients.length}</span> total &middot; <span className="font-medium text-green-600">{activeCount}</span> active
            </p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200">
              <Plus size={16} /> <span className="sm:hidden">Add</span><span className="hidden sm:inline">Add Client</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus size={18} className="text-primary-500" />
                Add New Client
              </DialogTitle>
            </DialogHeader>
            <AddClientForm
              onSuccess={() => {
                setDialogOpen(false);
                fetchClients();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1.5 text-neutral-500 hover:text-neutral-700 shrink-0 h-10"
          >
            <X size={14} /> Clear filters
          </Button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 mb-4">
          {error}
        </div>
      )}

      {/* Client List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-[72px] rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon bg-gradient-to-br from-primary-50 to-accent-50">
            <IllustrationEmptyClients width={80} height={80} />
          </div>
          <p className="text-neutral-700 font-semibold text-lg">
            {search ? "No clients match your search" : "Your client list is empty"}
          </p>
          {!search && (
            <>
              <p className="text-sm text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
                Start by adding your first client. You can track their sessions, notes, and payments all in one place.
              </p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="mt-5 gap-2"
              >
                <Plus size={16} /> Add Your First Client
              </Button>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table view */}
          <div className="hidden md:block bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/80">
                  <th className="text-left text-xs font-semibold text-neutral-500 px-5 py-3">
                    Client
                  </th>
                  <th className="text-left text-xs font-semibold text-neutral-500 px-5 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-neutral-500 px-5 py-3">
                    Last Session
                  </th>
                  <th className="text-left text-xs font-semibold text-neutral-500 px-5 py-3">
                    Sessions
                  </th>
                  <th className="text-left text-xs font-semibold text-neutral-500 px-5 py-3">
                    Outstanding
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-neutral-100 last:border-0 hover:bg-primary-50/30 transition-all duration-200 group card-accent"
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/clients/${client.id}`}
                        className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors"
                      >
                        {client.firstName} {client.lastName || ""}
                      </Link>
                      {client.presentingConcern && (
                        <p className="text-xs text-neutral-400 truncate max-w-[220px] mt-0.5">
                          {client.presentingConcern}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusColor[client.status] || "bg-neutral-50 text-neutral-600 border-neutral-200"}`}>
                        {client.status.toLowerCase().replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-neutral-500">
                      {client.lastSession
                        ? format(new Date(client.lastSession), "MMM d, yyyy")
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-neutral-500 tabular-nums">
                      {client.totalSessions}
                    </td>
                    <td className="px-5 py-3.5 text-sm tabular-nums">
                      {client.outstandingBalance > 0 ? (
                        <span className="text-accent-600 font-semibold">
                          {formatINR(client.outstandingBalance)}
                        </span>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-2 stagger-children">
            {filtered.map((client) => (
              <Link key={client.id} href={`/clients/${client.id}`}>
                <div className="bg-white rounded-xl border border-neutral-200/80 p-4 flex items-center gap-3 active:scale-[0.98] transition-transform">
                  {/* Avatar initial */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-white font-bold text-sm">
                      {client.firstName[0]}{client.lastName?.[0] || ""}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-neutral-900 text-sm truncate">
                        {client.firstName} {client.lastName || ""}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor[client.status] || "bg-neutral-50 text-neutral-600 border-neutral-200"}`}>
                        {client.status.toLowerCase().replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-neutral-400">
                      <span>{client.totalSessions} sessions</span>
                      {client.outstandingBalance > 0 && (
                        <span className="text-accent-500 font-medium">
                          {formatINR(client.outstandingBalance)} due
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-neutral-300 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AddClientForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to create client");
        setLoading(false);
        return;
      }

      onSuccess();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input id="firstName" name="firstName" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" className="mt-1.5" placeholder="client@email.com" />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <div className="relative mt-1.5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">+91</span>
          <Input id="phone" name="phone" type="tel" className="pl-12" placeholder="98765 43210" />
        </div>
      </div>
      <div>
        <Label htmlFor="presentingConcern">Presenting Concern</Label>
        <Textarea
          id="presentingConcern"
          name="presentingConcern"
          rows={2}
          className="mt-1.5"
          placeholder="What brings this client to you?"
        />
      </div>
      <div>
        <Label htmlFor="referralSource">Referral Source</Label>
        <Input id="referralSource" name="referralSource" className="mt-1.5" placeholder="e.g. Dr. Sharma, Google" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 flex items-center gap-2 animate-shake">
          <div className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" className="w-full h-12" disabled={loading}>
        {loading ? "Adding..." : "Add Client"}
      </Button>
    </form>
  );
}
