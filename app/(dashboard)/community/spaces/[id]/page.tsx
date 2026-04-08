"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  MessageCircle,
  User,
  Clock,
  Users,
  Shield,
  Lock,
} from "lucide-react";

interface SpaceDetail {
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

interface Post {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  author: {
    profile: {
      displayName: string;
      slug: string;
      role: string;
      avatarUrl: string | null;
    } | null;
  };
  _count: { comments: number };
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function SpaceDetailPage() {
  const { id } = useParams();
  const [space, setSpace] = useState<SpaceDetail | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/community/spaces/${id}`).then((r) => r.json()),
      fetch(`/api/community/spaces/${id}/posts`).then((r) => r.json()),
    ]).then(([spaceData, postsData]) => {
      setSpace(spaceData.space);
      setPosts(postsData.posts || []);
      setLoading(false);
    });
  }, [id]);

  async function toggleMembership() {
    if (!space) return;
    setJoining(true);
    const action = space.isMember ? "leave" : "join";
    const res = await fetch(`/api/community/spaces/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      setSpace((prev) =>
        prev
          ? {
              ...prev,
              isMember: !prev.isMember,
              _count: {
                ...prev._count,
                members: prev._count.members + (prev.isMember ? -1 : 1),
              },
            }
          : prev
      );
    }
    setJoining(false);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-6 px-4 animate-pulse">
        <div className="h-6 w-1/4 bg-neutral-200 rounded mb-4" />
        <div className="h-8 w-1/2 bg-neutral-200 rounded mb-3" />
        <div className="h-16 bg-neutral-100 rounded" />
      </div>
    );
  }

  if (!space) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <p className="text-neutral-500">Space not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <Link
        href="/community/spaces"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
      >
        <ArrowLeft size={16} />
        All Spaces
      </Link>

      {/* Space header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 sm:gap-3 min-w-0">
            <span className="text-2xl shrink-0">{space.iconEmoji || "💬"}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-heading font-bold text-neutral-900 leading-tight">
                  {space.name}
                </h1>
                {space.type === "MODERATED" && (
                  <Shield size={14} className="text-neutral-400 shrink-0" />
                )}
                {space.type === "PRIVATE" && (
                  <Lock size={14} className="text-neutral-400 shrink-0" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 line-clamp-2">
                {space.description}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {space._count.members} members
                </span>
                <span>{space._count.posts} posts</span>
              </div>
            </div>
          </div>
          <button
            onClick={toggleMembership}
            disabled={joining}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
              space.isMember
                ? "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                : "bg-primary-500 text-white hover:bg-primary-600"
            }`}
          >
            {joining ? "..." : space.isMember ? "Leave" : "Join"}
          </button>
        </div>
      </div>

      {/* New post button */}
      <div className="flex justify-end mb-3">
        <Link
          href={`/community/spaces/${id}/new-post`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus size={14} />
          New Post
        </Link>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-16 bg-neutral-50 rounded-xl">
          <MessageCircle className="mx-auto text-neutral-300 mb-3" size={48} />
          <p className="text-neutral-500">No posts yet</p>
          <p className="text-neutral-400 text-sm mt-1">
            Start a conversation in this space
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/community/spaces/${id}/posts/${post.id}`}
              className="block bg-white rounded-xl border border-neutral-200 p-4 hover:border-primary-200 hover:shadow-sm transition-all"
            >
              {post.isPinned && (
                <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-1 block">
                  Pinned
                </span>
              )}
              <h3 className="font-semibold text-neutral-900 mb-1">
                {post.title}
              </h3>
              <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                {post.content}
              </p>
              <div className="flex items-center gap-3 text-xs text-neutral-400">
                <div className="flex items-center gap-1">
                  <User size={12} />
                  {post.author.profile?.displayName}
                </div>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {timeAgo(post.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={12} />
                  {post._count.comments}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
