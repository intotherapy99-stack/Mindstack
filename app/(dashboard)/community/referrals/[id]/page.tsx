"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Clock,
  AlertTriangle,
  Send,
  CheckCircle,
  User,
} from "lucide-react";

interface Responder {
  profile: {
    displayName: string;
    slug: string;
    city: string;
    role: string;
    specializations: string[];
    avatarUrl: string | null;
  } | null;
}

interface Response {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  responder: Responder;
}

interface ReferralDetail {
  id: string;
  title: string;
  description: string;
  specializations: string[];
  city: string | null;
  modality: string | null;
  urgency: string;
  status: string;
  createdAt: string;
  authorId: string;
  author: {
    profile: {
      displayName: string;
      slug: string;
      city: string;
      role: string;
      avatarUrl: string | null;
    } | null;
  };
  responses: Response[];
}

function formatRole(role: string) {
  return role
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ReferralDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [referral, setReferral] = useState<ReferralDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    fetch(`/api/community/referrals/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setReferral(data.referral);
        // Check if current user is author by trying to see if we can update status
        fetch("/api/users/me")
          .then((r) => r.json())
          .then((me) => {
            if (me.id === data.referral?.authorId) setIsAuthor(true);
          });
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleRespond(e: React.FormEvent) {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/community/referrals/${id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error);
        return;
      }

      const { response } = await res.json();
      setReferral((prev) =>
        prev ? { ...prev, responses: [response, ...prev.responses] } : prev
      );
      setReplyMessage("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(status: string) {
    const res = await fetch(`/api/community/referrals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setReferral((prev) => (prev ? { ...prev, status } : prev));
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-6 px-4 animate-pulse">
        <div className="h-6 w-1/3 bg-neutral-200 rounded mb-4" />
        <div className="h-8 w-2/3 bg-neutral-200 rounded mb-3" />
        <div className="h-24 bg-neutral-100 rounded mb-4" />
      </div>
    );
  }

  if (!referral) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <p className="text-neutral-500">Referral not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <Link
        href="/community/referrals"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
      >
        <ArrowLeft size={16} />
        Back to Referrals
      </Link>

      {/* Main post */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6 mb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {referral.urgency === "URGENT" && (
                <Badge variant="error">Urgent</Badge>
              )}
              <Badge
                variant={
                  referral.status === "OPEN"
                    ? "active"
                    : referral.status === "FULFILLED"
                    ? "verified"
                    : "inactive"
                }
              >
                {referral.status}
              </Badge>
            </div>
            <h1 className="text-base sm:text-xl font-heading font-bold text-neutral-900">
              {referral.title}
            </h1>
          </div>
        </div>

        <p className="text-sm text-neutral-700 whitespace-pre-wrap mb-3">
          {referral.description}
        </p>

        {referral.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {referral.specializations.map((s) => (
              <Badge key={s} variant="default">
                {s}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-neutral-500 border-t border-neutral-100 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
              <User size={14} className="text-primary-600" />
            </div>
            <div>
              <span className="font-medium text-neutral-700">
                {referral.author.profile?.displayName}
              </span>
              {referral.author.profile?.role && (
                <span className="text-xs text-neutral-400 ml-1">
                  {formatRole(referral.author.profile.role)}
                </span>
              )}
            </div>
          </div>
          {referral.city && (
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {referral.city}
            </span>
          )}
          {referral.modality && (
            <Badge variant="unverified">{referral.modality.replace("_", " ")}</Badge>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Clock size={14} />
            {timeAgo(referral.createdAt)}
          </span>
        </div>

        {/* Author actions */}
        {isAuthor && referral.status === "OPEN" && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-100">
            <button
              onClick={() => handleStatusChange("FULFILLED")}
              className="px-4 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center gap-1"
            >
              <CheckCircle size={14} />
              Mark Fulfilled
            </button>
            <button
              onClick={() => handleStatusChange("CLOSED")}
              className="px-4 py-1.5 bg-neutral-100 text-neutral-600 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Responses */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Responses ({referral.responses.length})
        </h2>

        {referral.responses.length === 0 ? (
          <p className="text-sm text-neutral-500 bg-neutral-50 rounded-lg p-4 text-center">
            No responses yet. Be the first to offer help.
          </p>
        ) : (
          <div className="space-y-3">
            {referral.responses.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl border border-neutral-200 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                    <User size={14} className="text-primary-600" />
                  </div>
                  <div>
                    <span className="font-medium text-sm text-neutral-900">
                      {r.responder.profile?.displayName}
                    </span>
                    {r.responder.profile?.role && (
                      <span className="text-xs text-neutral-400 ml-1">
                        {formatRole(r.responder.profile.role)}
                      </span>
                    )}
                    {r.responder.profile?.city && (
                      <span className="text-xs text-neutral-400 ml-1">
                        - {r.responder.profile.city}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-neutral-400 ml-auto">
                    {timeAgo(r.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                  {r.message}
                </p>
                {r.responder.profile?.specializations &&
                  r.responder.profile.specializations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {r.responder.profile.specializations.slice(0, 5).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply form */}
      {referral.status === "OPEN" && !isAuthor && (
        <form
          onSubmit={handleRespond}
          className="bg-white rounded-xl border border-neutral-200 p-4"
        >
          <h3 className="text-sm font-semibold text-neutral-700 mb-2">
            Offer to help
          </h3>
          <textarea
            rows={3}
            placeholder="Describe how you can help — your specialization, availability, location, etc."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none mb-3"
          />
          <button
            type="submit"
            disabled={submitting || !replyMessage.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50 transition-colors"
          >
            <Send size={14} />
            {submitting ? "Sending..." : "Send Response"}
          </button>
        </form>
      )}
    </div>
  );
}
