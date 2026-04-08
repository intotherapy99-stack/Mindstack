"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Clock,
  MessageCircle,
  Send,
  CornerDownRight,
  Flag,
} from "lucide-react";

interface Profile {
  displayName: string;
  slug: string;
  role: string;
  avatarUrl: string | null;
}

interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  author: { profile: Profile | null };
  replies?: CommentData[];
}

interface PostDetail {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  author: { profile: Profile | null };
  space: { id: string; name: string; category: string };
  comments: CommentData[];
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

function formatRole(role: string) {
  return role.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function ReportButton({
  contentType,
  contentId,
  reportedIds,
  onReported,
}: {
  contentType: "POST" | "COMMENT";
  contentId: string;
  reportedIds: Set<string>;
  onReported: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const key = `${contentType}:${contentId}`;
  const alreadyReported = reportedIds.has(key);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/community/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, contentId, reason }),
      });
      if (res.ok) {
        toast.success("Report submitted");
        onReported(key);
        setOpen(false);
        setReason("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit report");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (alreadyReported) {
    return (
      <span className="text-xs text-neutral-400 flex items-center gap-1">
        <Flag size={12} /> Reported
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-1"
        title="Report"
      >
        <Flag size={12} />
        <span className="hidden sm:inline">Report</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-xl border border-neutral-200 shadow-lg p-5 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <Flag size={16} className="text-red-500" />
              Report {contentType === "POST" ? "Post" : "Comment"}
            </h3>
            <form onSubmit={handleSubmit}>
              <textarea
                rows={3}
                placeholder="Why are you reporting this content?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none resize-none mb-3"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !reason.trim()}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function CommentItem({
  comment,
  postId,
  onReplyAdded,
  reportedIds,
  onReported,
}: {
  comment: CommentData;
  postId: string;
  onReplyAdded: (reply: CommentData, parentId: string) => void;
  reportedIds: Set<string>;
  onReported: (key: string) => void;
}) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText, parentId: comment.id }),
      });
      if (res.ok) {
        const { comment: newReply } = await res.json();
        onReplyAdded(newReply, comment.id);
        setReplyText("");
        setReplying(false);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="group">
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
          <User size={14} className="text-neutral-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-medium text-sm text-neutral-900">
              {comment.author.profile?.displayName || "Unknown"}
            </span>
            {comment.author.profile?.role && (
              <span className="text-[10px] text-neutral-400">
                {formatRole(comment.author.profile.role)}
              </span>
            )}
            <span className="text-xs text-neutral-400">
              {timeAgo(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-neutral-700 whitespace-pre-wrap">
            {comment.content}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() => setReplying(!replying)}
              className="text-xs text-neutral-400 hover:text-primary-500 transition-colors"
            >
              Reply
            </button>
            <ReportButton
              contentType="COMMENT"
              contentId={comment.id}
              reportedIds={reportedIds}
              onReported={onReported}
            />
          </div>

          {replying && (
            <form onSubmit={handleReply} className="mt-2 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-1.5 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                autoFocus
              />
              <button
                type="submit"
                disabled={submitting || !replyText.trim()}
                className="px-3 py-1.5 bg-primary-500 text-white rounded-lg text-xs font-medium disabled:opacity-50"
              >
                <Send size={12} />
              </button>
            </form>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3 pl-4 border-l-2 border-neutral-100">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={12} className="text-neutral-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-xs text-neutral-900">
                        {reply.author.profile?.displayName || "Unknown"}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {timeAgo(reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700">{reply.content}</p>
                    <div className="mt-1">
                      <ReportButton
                        contentType="COMMENT"
                        contentId={reply.id}
                        reportedIds={reportedIds}
                        onReported={onReported}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  const { id: spaceId, postId } = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());

  function handleReported(key: string) {
    setReportedIds((prev) => { const next = new Set(prev); next.add(key); return next; });
  }

  useEffect(() => {
    fetch(`/api/community/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((data) => {
        setPost(data.post);
        if (data.reportedIds) {
          setReportedIds(new Set(data.reportedIds));
        }
      })
      .finally(() => setLoading(false));
  }, [postId]);

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });
      if (res.ok) {
        const { comment } = await res.json();
        setPost((prev) =>
          prev
            ? {
                ...prev,
                comments: [...prev.comments, { ...comment, replies: [] }],
                _count: { comments: prev._count.comments + 1 },
              }
            : prev
        );
        setCommentText("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleReplyAdded(reply: CommentData, parentId: string) {
    setPost((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: prev.comments.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), reply] }
            : c
        ),
        _count: { comments: prev._count.comments + 1 },
      };
    });
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-6 px-4 animate-pulse">
        <div className="h-6 w-1/4 bg-neutral-200 rounded mb-4" />
        <div className="h-8 w-2/3 bg-neutral-200 rounded mb-3" />
        <div className="h-32 bg-neutral-100 rounded" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <p className="text-neutral-500">Post not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <Link
        href={`/community/spaces/${spaceId}`}
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
      >
        <ArrowLeft size={16} />
        Back to {post.space.name}
      </Link>

      {/* Post */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6 mb-4">
        {post.isPinned && (
          <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-1.5 block">
            Pinned
          </span>
        )}
        <h1 className="text-base sm:text-xl font-heading font-bold text-neutral-900 mb-2">
          {post.title}
        </h1>
        <p className="text-sm text-neutral-700 whitespace-pre-wrap mb-3 leading-relaxed">
          {post.content}
        </p>
        <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-500 border-t border-neutral-100 pt-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
              <User size={12} className="text-primary-600" />
            </div>
            <div>
              <span className="font-medium text-neutral-700">
                {post.author.profile?.displayName}
              </span>
              {post.author.profile?.role && (
                <span className="text-xs text-neutral-400 ml-1">
                  {formatRole(post.author.profile.role)}
                </span>
              )}
            </div>
          </div>
          <span className="flex items-center gap-1 ml-auto">
            <Clock size={14} />
            {timeAgo(post.createdAt)}
          </span>
          <ReportButton
            contentType="POST"
            contentId={post.id}
            reportedIds={reportedIds}
            onReported={handleReported}
          />
        </div>
      </div>

      {/* Comments */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <MessageCircle size={18} />
          Comments ({post._count.comments})
        </h2>

        {post.comments.length === 0 ? (
          <p className="text-sm text-neutral-500 bg-neutral-50 rounded-lg p-4 text-center">
            No comments yet. Start the discussion.
          </p>
        ) : (
          <div className="space-y-5">
            {post.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={post.id}
                onReplyAdded={handleReplyAdded}
                reportedIds={reportedIds}
                onReported={handleReported}
              />
            ))}
          </div>
        )}
      </div>

      {/* New comment */}
      <form
        onSubmit={handleComment}
        className="bg-white rounded-xl border border-neutral-200 p-4"
      >
        <textarea
          rows={3}
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none mb-3"
        />
        <button
          type="submit"
          disabled={submitting || !commentText.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50 transition-colors"
        >
          <Send size={14} />
          {submitting ? "Posting..." : "Comment"}
        </button>
      </form>
    </div>
  );
}
