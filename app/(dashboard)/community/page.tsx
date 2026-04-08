"use client";

import React from "react";
import Link from "next/link";
import { ArrowRightLeft, MessageSquare, ArrowRight, Users } from "lucide-react";
import { IllustrationDiverseGroup } from "@/components/inclusive-illustrations";

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto page-enter">
      {/* Header with gradient and diverse illustration */}
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-teal-600 rounded-xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-16 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users size={22} className="text-primary-100" />
              <h1 className="font-heading text-2xl font-bold text-white">
                Community
              </h1>
            </div>
            <p className="text-primary-100 text-sm">
              Connect with fellow mental health professionals, share referrals, and discuss clinical topics
            </p>
          </div>
          <div className="hidden md:block shrink-0 opacity-90">
            <IllustrationDiverseGroup width={180} height={120} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
        {/* Referral Network */}
        <Link
          href="/community/referrals"
          className="bg-white rounded-2xl border border-neutral-200/80 p-6 card-lift hover:border-primary-200 hover:shadow-lg transition-all duration-300 group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-teal-50 flex items-center justify-center mb-4 shadow-sm">
            <ArrowRightLeft className="text-primary-500" size={24} />
          </div>
          <h2 className="text-lg font-heading font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
            Referral Network
          </h2>
          <p className="text-sm text-neutral-500 mb-4 leading-relaxed">
            Find or offer referrals for clients who need specialized care. Connect with practitioners across specializations and cities.
          </p>
          <span className="inline-flex items-center gap-1 text-sm text-primary-500 font-semibold">
            Browse Referrals
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        {/* Discussion Spaces */}
        <Link
          href="/community/spaces"
          className="bg-white rounded-2xl border border-neutral-200/80 p-6 card-lift hover:border-primary-200 hover:shadow-lg transition-all duration-300 group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-teal-50 flex items-center justify-center mb-4 shadow-sm">
            <MessageSquare className="text-primary-500" size={24} />
          </div>
          <h2 className="text-lg font-heading font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
            Discussion Spaces
          </h2>
          <p className="text-sm text-neutral-500 mb-4 leading-relaxed">
            Join topic-based discussions on clinical cases, ethics, business, training, and more with peers across India.
          </p>
          <span className="inline-flex items-center gap-1 text-sm text-primary-500 font-semibold">
            Explore Spaces
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>
    </div>
  );
}
