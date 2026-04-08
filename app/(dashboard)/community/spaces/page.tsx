"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Hash, Lock, Shield } from "lucide-react";
import { CommunityTabs } from "@/components/shared/community-tabs";

interface Space {
  id: string;
  name: string;
  description: string | null;
  category: string;
  type: string;
  iconEmoji: string | null;
  isMember: boolean;
  myRole: string | null;
  _count: { posts: number; members: number };
}

const CATEGORY_COLORS: Record<string, string> = {
  CLINICAL: "bg-blue-50 text-blue-700",
  BUSINESS: "bg-amber-50 text-amber-700",
  ETHICS: "bg-purple-50 text-purple-700",
  REGIONAL: "bg-green-50 text-green-700",
  TRAINING: "bg-orange-50 text-orange-700",
  GENERAL: "bg-neutral-100 text-neutral-600",
};

export default function SpacesListPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/community/spaces")
      .then((r) => r.json())
      .then((data) => setSpaces(data.spaces || []))
      .finally(() => setLoading(false));
  }, []);

  // Seed spaces if none exist
  useEffect(() => {
    if (!loading && spaces.length === 0) {
      fetch("/api/community/seed", { method: "POST" })
        .then((r) => r.json())
        .then(() => {
          // Re-fetch
          fetch("/api/community/spaces")
            .then((r) => r.json())
            .then((data) => setSpaces(data.spaces || []));
        });
    }
  }, [loading, spaces.length]);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <CommunityTabs />
      <div className="mb-4">
        <h1 className="text-lg sm:text-2xl font-heading font-bold text-neutral-900 flex items-center gap-2">
          <MessageSquare className="text-primary-500 shrink-0" size={20} />
          Discussion Spaces
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Join topic-based discussions with fellow mental health professionals
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-neutral-200 p-5 animate-pulse">
              <div className="h-6 w-6 bg-neutral-200 rounded mb-3" />
              <div className="h-5 w-2/3 bg-neutral-200 rounded mb-2" />
              <div className="h-4 w-full bg-neutral-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {spaces.map((space) => (
            <Link
              key={space.id}
              href={`/community/spaces/${space.id}`}
              className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-primary-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{space.iconEmoji || "💬"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors truncate">
                      {space.name}
                    </h3>
                    {space.type === "PRIVATE" && <Lock size={12} className="text-neutral-400" />}
                    {space.type === "MODERATED" && <Shield size={12} className="text-neutral-400" />}
                  </div>
                  <p className="text-sm text-neutral-500 line-clamp-2 mb-3">
                    {space.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${CATEGORY_COLORS[space.category] || CATEGORY_COLORS.GENERAL}`}>
                      {space.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {space._count.members}
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash size={12} />
                      {space._count.posts} posts
                    </span>
                    {space.isMember && (
                      <Badge variant="active" className="text-[10px]">
                        Joined
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
