"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verifyStatus, setVerifyStatus] = useState<Status>("idle");
  const [verifyMessage, setVerifyMessage] = useState("");

  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<Status>("idle");
  const [resendMessage, setResendMessage] = useState("");

  // If token is present, verify on mount
  useEffect(() => {
    if (!token) return;

    async function verify() {
      setVerifyStatus("loading");
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          setVerifyStatus("error");
          setVerifyMessage(data.error || "Verification failed");
          return;
        }

        setVerifyStatus("success");
        setVerifyMessage(data.message);
      } catch {
        setVerifyStatus("error");
        setVerifyMessage("Something went wrong. Please try again.");
      }
    }

    verify();
  }, [token]);

  async function handleResend() {
    if (!resendEmail) return;

    setResendStatus("loading");
    setResendMessage("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResendStatus("error");
        setResendMessage(data.error || "Failed to send email");
        return;
      }

      setResendStatus("success");
      setResendMessage(data.message);
    } catch {
      setResendStatus("error");
      setResendMessage("Something went wrong. Please try again.");
    }
  }

  // Token verification view
  if (token) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "#ffffff" }}
      >
        <div className="w-full max-w-[400px] text-center">
          {verifyStatus === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={48} className="text-primary-500 animate-spin" />
              <p className="text-neutral-600 text-[15px]">
                Verifying your email...
              </p>
            </div>
          )}

          {verifyStatus === "success" && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 size={48} className="text-green-500" />
              <h2 className="font-heading text-2xl font-bold text-neutral-900">
                Email Verified
              </h2>
              <p className="text-neutral-500 text-[15px]">{verifyMessage}</p>
              <Button
                className="w-full h-12 text-[15px] font-semibold mt-4"
                onClick={() => (window.location.href = "/login")}
              >
                Continue to Sign In
              </Button>
            </div>
          )}

          {verifyStatus === "error" && (
            <div className="flex flex-col items-center gap-4">
              <XCircle size={48} className="text-red-500" />
              <h2 className="font-heading text-2xl font-bold text-neutral-900">
                Verification Failed
              </h2>
              <p className="text-neutral-500 text-[15px]">{verifyMessage}</p>
              <Button
                variant="secondary"
                className="w-full h-12 text-[15px] font-medium mt-4"
                onClick={() => (window.location.href = "/verify-email")}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // No token: "Check your email" view with resend
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#ffffff" }}
    >
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
            <Mail size={32} className="text-primary-500" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-neutral-500 text-[15px] leading-relaxed">
            We sent you a verification link. Click the link in your email to
            verify your account.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-neutral-600 text-sm font-medium">
            Didn&apos;t receive the email? Enter your address to resend.
          </p>

          <Input
            type="email"
            placeholder="you@example.com"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            className="h-12 transition-shadow duration-200 focus:shadow-md"
          />

          <Button
            className="w-full h-12 text-[15px] font-semibold"
            disabled={resendStatus === "loading" || !resendEmail}
            onClick={handleResend}
          >
            {resendStatus === "loading" ? (
              <span className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Sending...
              </span>
            ) : (
              "Resend Verification Email"
            )}
          </Button>

          {resendStatus === "success" && (
            <div
              className="text-green-700 text-sm rounded-xl p-3.5 flex items-center gap-2.5"
              style={{ background: "rgba(34,197,94,0.1)" }}
            >
              <CheckCircle2 size={16} className="shrink-0" />
              {resendMessage}
            </div>
          )}

          {resendStatus === "error" && (
            <div
              className="text-error text-sm rounded-xl p-3.5 flex items-center gap-2.5"
              style={{ background: "rgba(250,116,111,0.12)" }}
            >
              <XCircle size={16} className="shrink-0" />
              {resendMessage}
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-neutral-400 mt-8 leading-relaxed">
          The verification link expires in 24 hours.
        </p>
      </div>
    </div>
  );
}
