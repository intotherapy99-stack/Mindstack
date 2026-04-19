"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#ffffff" }}>
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-primary to-primary-dim flex items-center justify-center shadow-sm">
            <span className="text-white font-heading font-bold text-lg">M</span>
          </div>
          <span className="font-heading font-bold text-xl text-neutral-900">MindStack</span>
        </div>

        {submitted ? (
          /* Success state */
          <div>
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mb-5">
              <Mail size={22} className="text-primary-600" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
              Check your email
            </h2>
            <p className="text-neutral-500 text-[15px] mb-7 leading-relaxed">
              If an account exists for <span className="font-medium text-neutral-700">{email}</span>,
              we've sent a password reset link. Check your email for a reset link.
            </p>
            <Link href="/login">
              <Button variant="secondary" className="w-full h-12 font-medium flex items-center justify-center gap-2">
                <ArrowLeft size={16} />
                Back to login
              </Button>
            </Link>
          </div>
        ) : (
          /* Form state */
          <div>
            <h2 className="font-heading text-2xl lg:text-[28px] font-bold text-neutral-900 mb-1.5">
              Forgot your password?
            </h2>
            <p className="text-neutral-500 mb-7 text-[15px]">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-[13px]">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 h-12 transition-shadow duration-200 focus:shadow-md"
                />
              </div>

              {error && (
                <div
                  className="text-error text-sm rounded-xl p-3.5 flex items-center gap-2.5 animate-error-fade"
                  style={{ background: "rgba(250,116,111,0.12)" }}
                >
                  <div className="w-2 h-2 bg-error rounded-full shrink-0 animate-soft-pulse" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-[15px] font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail size={16} />
                    Send Reset Link
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors inline-flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
