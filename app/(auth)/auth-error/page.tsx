"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Lock, Settings, RefreshCw, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ERROR_MAP: Record<string, {
  title: string;
  description: string;
  action?: { label: string; href: string };
  hint?: string;
}> = {
  AccessDenied: {
    title: "Access denied",
    description: "Google declined the sign-in. This usually means your Google account isn't in the approved test users list yet.",
    hint: "Fix: Go to Google Cloud Console → Google Auth Platform → Audience → Test Users → add your email, then try again.",
    action: { label: "Try signing in again", href: "/login" },
  },
  Configuration: {
    title: "Server configuration error",
    description: "There's a problem with the authentication setup. This is usually a temporary issue.",
    action: { label: "Try again", href: "/login" },
  },
  Verification: {
    title: "Link expired",
    description: "This sign-in link has expired or has already been used. Please request a new one.",
    action: { label: "Back to login", href: "/login" },
  },
  OAuthSignin: {
    title: "Google sign-in failed",
    description: "Could not start the Google sign-in flow. Please try again.",
    action: { label: "Try again", href: "/login" },
  },
  OAuthCallback: {
    title: "Google callback error",
    description: "There was a problem handling Google's response. Please try signing in again.",
    action: { label: "Try again", href: "/login" },
  },
  OAuthCreateAccount: {
    title: "Could not create account",
    description: "Unable to create your account from Google sign-in. Please try signing up with email instead.",
    action: { label: "Sign up with email", href: "/signup" },
  },
  EmailCreateAccount: {
    title: "Could not create account",
    description: "Unable to create your account. Please try again or contact support.",
    action: { label: "Try again", href: "/signup" },
  },
  Callback: {
    title: "Sign-in callback error",
    description: "Something went wrong during sign-in. Please try again.",
    action: { label: "Try again", href: "/login" },
  },
  CredentialsSignin: {
    title: "Incorrect credentials",
    description: "The email or password you entered is incorrect.",
    action: { label: "Try again", href: "/login" },
  },
  SessionRequired: {
    title: "Sign in required",
    description: "You need to be signed in to access this page.",
    action: { label: "Sign in", href: "/login" },
  },
};

const DEFAULT_ERROR = {
  title: "Authentication error",
  description: "Something went wrong during sign-in. Please try again.",
  action: { label: "Back to login", href: "/login" },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") || "";
  const info = ERROR_MAP[errorCode] || DEFAULT_ERROR;

  const iconMap: Record<string, React.ReactNode> = {
    AccessDenied: <Lock size={28} className="text-amber-500" />,
    Configuration: <Settings size={28} className="text-red-500" />,
  };
  const Icon = iconMap[errorCode] || <AlertCircle size={28} className="text-red-500" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-gradient p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-heading font-bold text-neutral-900 text-lg">MindStack</span>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8 space-y-6">
          {/* Icon + title */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              {Icon}
            </div>
            <h1 className="font-heading text-xl font-bold text-neutral-900 mb-2">
              {info.title}
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {info.description}
            </p>
          </div>

          {/* Hint box for AccessDenied */}
          {info.hint && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">How to fix: </span>
                {info.hint}
              </p>
            </div>
          )}

          {/* Error code badge */}
          {errorCode && (
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-500 text-xs rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                error: {errorCode}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {info.action && (
              <Button asChild className="w-full">
                <Link href={info.action.href}>
                  <RefreshCw size={16} className="mr-2" />
                  {info.action.label}
                </Link>
              </Button>
            )}
            <Button asChild variant="ghost" className="w-full">
              <Link href="/signup">
                <Mail size={16} className="mr-2" />
                Sign up with email instead
              </Link>
            </Button>
          </div>

          {/* Back link */}
          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <ArrowLeft size={12} />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
