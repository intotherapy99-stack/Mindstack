"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { signupSchema, clientSignupSchema, type SignupInput, type ClientSignupInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IllustrationOnboarding, IllustrationMeditation } from "@/components/illustrations";
import { FaceCurlyWoman, FaceBeardMan, FaceBobWoman, FaceHijabWoman, FaceSpikyMan } from "@/components/inclusive-illustrations";
import { Brain, Heart, Shield, Eye, EyeOff, Loader2, Stethoscope, User } from "lucide-react";

type UserMode = "professional" | "client";

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "client" ? "client" : "professional";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mode, setMode] = useState<UserMode>(initialMode);

  const isPro = mode === "professional";

  // Professional form
  const proForm = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  // Client form
  const clientForm = useForm<ClientSignupInput>({
    resolver: zodResolver(clientSignupSchema),
  });

  async function handleRegister(data: { email: string; password: string; name: string; phone?: string }) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
          phone: data.phone || undefined,
          userType: isPro ? "PROFESSIONAL" : "CLIENT",
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Auto-sign in
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Account created but auto-login failed, redirect to login
        router.push("/login");
        return;
      }

      if (isPro) {
        router.push("/onboarding?step=1");
      } else {
        router.push("/my-care");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function onProSubmit(data: SignupInput) {
    handleRegister({ email: data.email, password: data.password, name: data.name, phone: data.phone });
  }

  function onClientSubmit(data: ClientSignupInput) {
    handleRegister({ email: data.email, password: data.password, name: data.name });
  }

  const trustPills = isPro
    ? [
        { icon: Brain, text: "Structured supervision tracking" },
        { icon: Heart, text: "Built for therapists" },
        { icon: Shield, text: "DPDP compliant" },
      ]
    : [
        { icon: Heart, text: "Find verified therapists" },
        { icon: Shield, text: "End-to-end encrypted" },
        { icon: Brain, text: "Track your progress" },
      ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel */}
      <div className="hidden md:flex md:w-[50%] lg:w-[55%] bg-warm-gradient relative overflow-hidden p-8 lg:p-12 xl:p-16 flex-col justify-between">
        <div className="absolute top-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full bg-primary-300/20 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-40px] w-[320px] h-[320px] rounded-full bg-accent-300/15 blur-3xl" />
        <div className="absolute top-[30%] left-[20%] w-[200px] h-[200px] rounded-full bg-purple-200/20 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10 lg:mb-14">
            <div className="w-11 h-11 rounded-xl bg-primary-500 flex items-center justify-center shadow-md">
              <span className="text-white font-heading font-bold text-xl">M</span>
            </div>
            <span className="font-heading font-bold text-2xl text-neutral-900">MindStack</span>
          </div>

          <div className="flex justify-center mb-10 lg:mb-12">
            <div className="animate-float">
              {isPro ? (
                <IllustrationOnboarding className="drop-shadow-lg" width={280} height={280} />
              ) : (
                <IllustrationMeditation className="drop-shadow-lg" width={280} height={280} />
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 mb-8">
            {trustPills.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-white/80"
              >
                <Icon size={14} className="text-primary-600 shrink-0" />
                <span className="text-neutral-700 text-xs font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex -space-x-1.5">
            {[FaceCurlyWoman, FaceBeardMan, FaceBobWoman, FaceHijabWoman, FaceSpikyMan].map((Face, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-white/80 border-2 border-white flex items-center justify-center shadow-sm overflow-hidden"
                style={{ zIndex: 5 - i }}
              >
                <Face width={36} height={36} />
              </div>
            ))}
          </div>
          <p className="text-neutral-600 text-sm font-medium">
            {isPro
              ? <>Trusted by <span className="text-neutral-800 font-semibold">500+</span> professionals</>
              : <>Join <span className="text-neutral-800 font-semibold">2,000+</span> people on their wellness journey</>
            }
          </p>
        </div>
      </div>

      {/* Right panel — signup form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12 bg-white min-h-screen md:min-h-0 overflow-y-auto">
        <div className="w-full max-w-[400px]">
          {/* Mobile header */}
          <div className="md:hidden mb-6">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-sm">
                <span className="text-white font-heading font-bold text-lg">M</span>
              </div>
              <span className="font-heading font-bold text-xl text-neutral-900">MindStack</span>
            </div>
          </div>

          {/* User Type Toggle */}
          <div className="flex bg-neutral-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode("professional")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
                isPro
                  ? "bg-white shadow-sm text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <Stethoscope size={16} />
              Professional
            </button>
            <button
              type="button"
              onClick={() => setMode("client")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
                !isPro
                  ? "bg-white shadow-sm text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <User size={16} />
              Client
            </button>
          </div>

          {/* Heading */}
          <h2 className="font-heading text-2xl lg:text-[28px] font-bold text-neutral-900 mb-1.5">
            {isPro ? "Start your practice journey" : "Begin your wellness journey"}
          </h2>
          <p className="text-neutral-500 mb-7 text-[15px]">
            {isPro
              ? "Set up your digital practice in under 5 minutes"
              : "Find the right therapist and book your first session"
            }
          </p>

          {/* === PROFESSIONAL FORM === */}
          {isPro ? (
            <form onSubmit={proForm.handleSubmit(onProSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-[13px]">Full name</Label>
                <Input
                  id="name"
                  placeholder="Dr. Priya Sharma"
                  autoComplete="name"
                  {...proForm.register("name")}
                  className="mt-1.5 h-12"
                />
                {proForm.formState.errors.name && (
                  <p className="text-error text-xs mt-1.5">{proForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-[13px]">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...proForm.register("email")}
                  className="mt-1.5 h-12"
                />
                {proForm.formState.errors.email && (
                  <p className="text-error text-xs mt-1.5">{proForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-[13px]">Phone number</Label>
                <div className="relative mt-1.5">
                  <div className="absolute left-0 top-0 h-12 flex items-center pl-3.5 pr-2.5 pointer-events-none border-r border-neutral-200">
                    <span className="text-sm text-neutral-500 flex items-center gap-1.5">
                      <span className="text-base leading-none">🇮🇳</span>
                      <span className="font-medium">+91</span>
                    </span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98765 43210"
                    autoComplete="tel"
                    {...proForm.register("phone")}
                    className="h-12 pl-[5.5rem]"
                  />
                </div>
                {proForm.formState.errors.phone && (
                  <p className="text-error text-xs mt-1.5">{proForm.formState.errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-[13px]">Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    autoComplete="new-password"
                    {...proForm.register("password")}
                    className="h-12 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {proForm.formState.errors.password && (
                  <p className="text-error text-xs mt-1.5">{proForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-[13px]">Confirm password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    {...proForm.register("confirmPassword")}
                    className="h-12 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {proForm.formState.errors.confirmPassword && (
                  <p className="text-error text-xs mt-1.5">{proForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50/80 border border-red-200/60 text-red-600 text-sm rounded-xl p-3.5 flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-red-400 rounded-full shrink-0 animate-soft-pulse" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-[15px] font-semibold" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" /> Creating account...
                  </span>
                ) : "Create professional account"}
              </Button>

              <p className="text-center text-xs text-neutral-400">
                Free forever for up to 5 clients
              </p>
            </form>
          ) : (
            /* === CLIENT FORM === */
            <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="c-name" className="text-[13px]">Your name</Label>
                <Input
                  id="c-name"
                  placeholder="e.g. Meera Nair"
                  autoComplete="name"
                  {...clientForm.register("name")}
                  className="mt-1.5 h-12"
                />
                {clientForm.formState.errors.name && (
                  <p className="text-error text-xs mt-1.5">{clientForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="c-email" className="text-[13px]">Email address</Label>
                <Input
                  id="c-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...clientForm.register("email")}
                  className="mt-1.5 h-12"
                />
                {clientForm.formState.errors.email && (
                  <p className="text-error text-xs mt-1.5">{clientForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="c-password" className="text-[13px]">Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="c-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    autoComplete="new-password"
                    {...clientForm.register("password")}
                    className="h-12 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {clientForm.formState.errors.password && (
                  <p className="text-error text-xs mt-1.5">{clientForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="c-confirmPassword" className="text-[13px]">Confirm password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="c-confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    {...clientForm.register("confirmPassword")}
                    className="h-12 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {clientForm.formState.errors.confirmPassword && (
                  <p className="text-error text-xs mt-1.5">{clientForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50/80 border border-red-200/60 text-red-600 text-sm rounded-xl p-3.5 flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-red-400 rounded-full shrink-0 animate-soft-pulse" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-[15px] font-semibold" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" /> Creating account...
                  </span>
                ) : "Create client account"}
              </Button>

              <p className="text-center text-xs text-neutral-400">
                100% free — no credit card required
              </p>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-neutral-400">or</span>
            </div>
          </div>

          {/* Google Sign Up */}
          <Button
            type="button"
            variant="secondary"
            className="w-full h-12 font-medium flex items-center justify-center gap-3 mb-4"
            onClick={() => {
              setLoading(true);
              signIn("google", { callbackUrl: isPro ? "/onboarding?step=1" : "/my-care" });
            }}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

          <Link href="/login" className="block">
            <Button variant="secondary" className="w-full h-12 font-medium">Already have an account? Sign in</Button>
          </Link>

          <p className="text-center text-[11px] text-neutral-400 mt-6 leading-relaxed">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="underline hover:text-neutral-600">Terms</Link>{" "}
            &amp;{" "}
            <Link href="/privacy" className="underline hover:text-neutral-600">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
