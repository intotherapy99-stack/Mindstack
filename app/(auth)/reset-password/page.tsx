"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // No token provided
  if (!token) {
    return (
      <div>
        <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
          Invalid reset link
        </h2>
        <p className="text-neutral-500 text-[15px] mb-7 leading-relaxed">
          This password reset link is invalid or missing. Please request a new one.
        </p>
        <Link href="/forgot-password">
          <Button className="w-full h-12 text-[15px] font-semibold">
            Request new reset link
          </Button>
        </Link>
        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div>
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-5">
          <CheckCircle size={22} className="text-green-600" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
          Password reset!
        </h2>
        <p className="text-neutral-500 text-[15px] leading-relaxed">
          Your password has been updated. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading text-2xl lg:text-[28px] font-bold text-neutral-900 mb-1.5">
        Set a new password
      </h2>
      <p className="text-neutral-500 mb-7 text-[15px]">
        Choose a strong password for your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="password" className="text-[13px]">
            New password
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 pr-11 transition-shadow duration-200 focus:shadow-md"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-[13px]">
            Confirm password
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 pr-11 transition-shadow duration-200 focus:shadow-md"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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
              Resetting...
            </span>
          ) : (
            "Reset password"
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
  );
}

export default function ResetPasswordPage() {
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

        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-neutral-400" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
