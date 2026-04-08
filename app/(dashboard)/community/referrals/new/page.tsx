"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const SPECIALIZATIONS = [
  "Anxiety", "Depression", "PTSD", "OCD", "ADHD", "Autism",
  "Substance Abuse", "Eating Disorders", "Couples Therapy",
  "Child & Adolescent", "Grief & Loss", "Trauma", "Personality Disorders",
  "Psychosis", "Geriatric", "LGBTQIA+", "Women's Health",
  "Neuropsychology", "Rehabilitation", "Career Counseling",
];

export default function NewReferralPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    specializations: [] as string[],
    city: "",
    modality: "",
    urgency: "NORMAL",
  });

  function toggleSpec(s: string) {
    setForm((f) => ({
      ...f,
      specializations: f.specializations.includes(s)
        ? f.specializations.filter((x) => x !== s)
        : [...f.specializations, s],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/community/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to post referral");
        return;
      }

      const { referral } = await res.json();
      router.push(`/community/referrals/${referral.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <Link
        href="/community/referrals"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
      >
        <ArrowLeft size={16} />
        Back to Referrals
      </Link>

      <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-1">
        Post a Referral Request
      </h1>
      <p className="text-sm text-neutral-500 mb-6">
        Describe what kind of professional you&apos;re looking for. Keep client details anonymized.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Need EMDR therapist in Mumbai for trauma case"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            required
            rows={4}
            placeholder="Describe the client's needs (anonymized), preferred modality, age group, language requirements, etc."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Do not include any identifying client information
          </p>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Urgency
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, urgency: "NORMAL" })}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                form.urgency === "NORMAL"
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
              }`}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, urgency: "URGENT" })}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                form.urgency === "URGENT"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
              }`}
            >
              Urgent
            </button>
          </div>
        </div>

        {/* Specializations */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Specializations Needed
          </label>
          <div className="flex flex-wrap gap-2">
            {SPECIALIZATIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSpec(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  form.specializations.includes(s)
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* City & Modality */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Preferred City
            </label>
            <input
              type="text"
              placeholder="e.g., Mumbai"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Preferred Modality
            </label>
            <select
              value={form.modality}
              onChange={(e) => setForm({ ...form, modality: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
            >
              <option value="">Any</option>
              <option value="IN_PERSON">In-Person</option>
              <option value="ONLINE">Online</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !form.title || !form.description}
          className="w-full py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Posting..." : "Post Referral Request"}
        </button>
      </form>
    </div>
  );
}
