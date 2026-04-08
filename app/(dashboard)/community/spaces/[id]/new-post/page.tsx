"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/community/spaces/${id}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to create post");
        return;
      }

      const { post } = await res.json();
      router.push(`/community/spaces/${id}/posts/${post.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <Link
        href={`/community/spaces/${id}`}
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
      >
        <ArrowLeft size={16} />
        Back to Space
      </Link>

      <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
        New Post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Title
          </label>
          <input
            type="text"
            required
            placeholder="What would you like to discuss?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Content
          </label>
          <textarea
            required
            rows={8}
            placeholder="Share your thoughts, questions, or insights..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Remember to anonymize any client information in clinical discussions
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim() || !content.trim()}
          className="w-full py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Posting..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}
