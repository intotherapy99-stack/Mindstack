"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightLeft,
  Plus,
  MapPin,
  Clock,
  MessageCircle,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { CommunityTabs } from "@/components/shared/community-tabs";

interface ReferralPost {
  id: string;
  title: string;
  description: string;
  specializations: string[];
  city: string | null;
  modality: string | null;
  urgency: string;
  status: string;
  createdAt: string;
  author: {
    profile: {
      displayName: string;
      slug: string;
      city: string;
      role: string;
    } | null;
  };
  _count: { responses: number };
}

export default function ReferralBoardPage() {
  const [referrals, setReferrals] = useState<ReferralPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [cityFilter, setCityFilter] = useState("");
  const [specFilter, setSpecFilter] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter === "mine") params.set("mine", "true");
    if (cityFilter) params.set("city", cityFilter);
    if (specFilter) params.set("specialization", specFilter);

    fetch(`/api/community/referrals?${params}`)
      .then((r) => r.json())
      .then((data) => setReferrals(data.referrals || []))
      .finally(() => setLoading(false));
  }, [filter, cityFilter, specFilter]);

  const cities = useMemo(
    () =>
      Array.from(
        new Set(referrals.map((r) => r.city).filter(Boolean) as string[])
      ),
    [referrals]
  );

  const specs = useMemo(
    () =>
      Array.from(new Set(referrals.flatMap((r) => r.specializations))),
    [referrals]
  );

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <CommunityTabs />
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-heading font-bold text-neutral-900 flex items-center gap-2">
            <ArrowRightLeft className="text-primary-500 shrink-0" size={20} />
            Referral Network
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Find or offer referrals for clients who need specialized care
          </p>
        </div>
        <Link
          href="/community/referrals/new"
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-600 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus size={14} />
          Post Referral
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex bg-neutral-100 rounded-lg p-0.5">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500"
            }`}
          >
            All Referrals
          </button>
          <button
            onClick={() => setFilter("mine")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === "mine"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500"
            }`}
          >
            My Posts
          </button>
        </div>

        {cities.length > 0 && (
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-1.5 border border-neutral-200 rounded-lg text-sm bg-white"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {specs.length > 0 && (
          <select
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            className="px-3 py-1.5 border border-neutral-200 rounded-lg text-sm bg-white"
          >
            <option value="">All Specializations</option>
            {specs.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-neutral-200 p-5 animate-pulse">
              <div className="h-5 w-2/3 bg-neutral-200 rounded mb-3" />
              <div className="h-4 w-full bg-neutral-100 rounded mb-2" />
              <div className="h-4 w-1/2 bg-neutral-100 rounded" />
            </div>
          ))}
        </div>
      ) : referrals.length === 0 ? (
        <div className="text-center py-12">
          <ArrowRightLeft className="mx-auto text-neutral-300 mb-2" size={36} />
          <p className="text-neutral-500 text-sm">No referral requests yet</p>
          <p className="text-neutral-400 text-xs mt-1">
            Be the first to post a referral request for your community
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {referrals.map((r) => (
            <Link
              key={r.id}
              href={`/community/referrals/${r.id}`}
              className="block bg-white rounded-xl border border-neutral-200 p-5 hover:border-primary-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {r.urgency === "URGENT" && (
                      <AlertTriangle size={14} className="text-red-500 shrink-0" />
                    )}
                    <h3 className="font-semibold text-neutral-900 truncate">
                      {r.title}
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                    {r.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {r.specializations.map((s) => (
                      <Badge key={s} variant="default">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-neutral-400">
                    <span>{r.author.profile?.displayName}</span>
                    {r.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {r.city}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {timeAgo(r.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={12} />
                      {r._count.responses} {r._count.responses === 1 ? "response" : "responses"}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  {r.urgency === "URGENT" && (
                    <Badge variant="error">Urgent</Badge>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
