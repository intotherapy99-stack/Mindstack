"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { StepBasicInfo } from "@/components/forms/onboarding-basic";
import { StepRole } from "@/components/forms/onboarding-role";
import { StepCredentials } from "@/components/forms/onboarding-credentials";
import { StepSpecializations } from "@/components/forms/onboarding-specializations";
import { StepSupervision } from "@/components/forms/onboarding-supervision";
import {
  User,
  Briefcase,
  FileCheck,
  Sparkles,
  Heart,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { BlobDecoration1, BlobDecoration2, DiverseFacesRow } from "@/components/inclusive-illustrations";

const TOTAL_STEPS = 5;

const STEP_META = [
  {
    icon: User,
    label: "About You",
    subtitle: "Let's start with the basics",
    color: "text-primary-500",
    bg: "bg-primary-50",
    ring: "ring-primary-200",
  },
  {
    icon: Briefcase,
    label: "Your Role",
    subtitle: "What kind of professional are you?",
    color: "text-blue-500",
    bg: "bg-blue-50",
    ring: "ring-blue-200",
  },
  {
    icon: FileCheck,
    label: "Credentials",
    subtitle: "Verify your qualifications",
    color: "text-amber-500",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
  },
  {
    icon: Sparkles,
    label: "Specializations",
    subtitle: "What do you work with?",
    color: "text-purple-500",
    bg: "bg-purple-50",
    ring: "ring-purple-200",
  },
  {
    icon: Heart,
    label: "Supervision",
    subtitle: "Give back to the community",
    color: "text-accent-500",
    bg: "bg-accent-50",
    ring: "ring-accent-200",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateData(data: Record<string, any>) {
    setFormData((prev) => ({ ...prev, ...data }));
  }

  function nextStep() {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  }

  function prevStep() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  async function handleComplete(supervisionData: Record<string, any>) {
    setLoading(true);
    setError("");
    const finalData = { ...formData, ...supervisionData };

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  }

  const currentMeta = STEP_META[step - 1];
  const CurrentStepIcon = currentMeta.icon;

  return (
    <div className="min-h-screen bg-mesh-gradient flex flex-col relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-20 pointer-events-none">
        <BlobDecoration1 width={300} height={300} />
      </div>
      <div className="absolute bottom-10 -right-20 pointer-events-none">
        <BlobDecoration2 width={280} height={280} />
      </div>
      {/* Top bar */}
      <div className="sticky top-0 z-10 glass border-b border-neutral-200/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-heading font-bold text-sm">M</span>
            </div>
            <span className="font-heading font-bold text-lg text-neutral-900">
              MindStack
            </span>
          </div>
          <span className="text-xs text-neutral-400 bg-white/80 px-2.5 py-1 rounded-full border border-neutral-100">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start md:items-center justify-center p-4 pt-6 md:pt-4 pb-8">
        <div className="w-full max-w-lg">
          {/* Step indicators - horizontal pills on mobile, circles on desktop */}
          <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-6">
            {STEP_META.map((meta, i) => {
              const Icon = meta.icon;
              const stepNum = i + 1;
              const isCompleted = stepNum < step;
              const isCurrent = stepNum === step;

              return (
                <React.Fragment key={i}>
                  {/* Mobile: small dots / Desktop: icon circles */}
                  <div
                    className={`
                      transition-all duration-300 flex items-center justify-center
                      ${isCurrent
                        ? "w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white shadow-lg ring-2 " + meta.ring + " scale-105"
                        : isCompleted
                          ? "w-8 h-8 md:w-9 md:h-9 rounded-xl bg-green-500 text-white shadow-sm"
                          : "w-8 h-8 md:w-9 md:h-9 rounded-xl bg-white/60 text-neutral-300 border border-neutral-200/50"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="text-white" />
                    ) : (
                      <Icon
                        size={isCurrent ? 18 : 14}
                        className={isCurrent ? meta.color : "text-neutral-300"}
                      />
                    )}
                  </div>
                  {i < STEP_META.length - 1 && (
                    <div
                      className={`w-4 md:w-6 h-0.5 rounded-full transition-colors duration-300 ${
                        isCompleted ? "bg-green-400" : "bg-neutral-200/60"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Current step header */}
          <div className="text-center mb-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${currentMeta.bg} mb-2`}>
              <CurrentStepIcon size={14} className={currentMeta.color} />
              <span className={`text-xs font-semibold ${currentMeta.color}`}>
                {currentMeta.label}
              </span>
            </div>
            <p className="text-sm text-neutral-500">{currentMeta.subtitle}</p>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <Progress value={(step / TOTAL_STEPS) * 100} />
          </div>

          {/* Step content card */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-lg shadow-neutral-200/30 p-5 md:p-7 page-enter">
            {step === 1 && (
              <StepBasicInfo
                data={formData}
                onNext={(data) => {
                  updateData(data);
                  nextStep();
                }}
              />
            )}
            {step === 2 && (
              <StepRole
                data={formData}
                onNext={(data) => {
                  updateData(data);
                  nextStep();
                }}
                onBack={prevStep}
              />
            )}
            {step === 3 && (
              <StepCredentials
                data={formData}
                onNext={(data) => {
                  updateData(data);
                  nextStep();
                }}
                onBack={prevStep}
              />
            )}
            {step === 4 && (
              <StepSpecializations
                data={formData}
                onNext={(data) => {
                  updateData(data);
                  nextStep();
                }}
                onBack={prevStep}
              />
            )}
            {step === 5 && (
              <StepSupervision
                data={formData}
                onComplete={handleComplete}
                onBack={prevStep}
                loading={loading}
              />
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 flex items-center gap-2 animate-shake">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Skip link */}
          <div className="text-center mt-5">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              Skip for now — you can complete this later in Settings
            </button>
          </div>

          {/* Inclusive community strip */}
          <div className="flex items-center justify-center gap-3 mt-8 opacity-50">
            <DiverseFacesRow width={240} height={40} />
            <p className="text-[11px] text-neutral-400 font-medium">Join your community</p>
          </div>
        </div>
      </div>
    </div>
  );
}
