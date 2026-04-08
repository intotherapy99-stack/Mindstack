"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PROFESSIONAL_ROLES } from "@/lib/constants";
import {
  Brain,
  Microscope,
  MessageCircle,
  Heart,
  GraduationCap,
} from "lucide-react";

const iconMap = {
  Brain,
  Microscope,
  MessageCircle,
  Heart,
  GraduationCap,
} as const;

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
}

export function StepRole({ data, onNext, onBack }: Props) {
  const [selected, setSelected] = useState<string>(data.role || "");

  function handleSubmit() {
    if (selected) {
      onNext({ role: selected });
    }
  }

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-neutral-900 mb-1">
        What&apos;s your role?
      </h2>
      <p className="text-sm text-neutral-500 mb-6">
        This helps us customize your experience
      </p>

      <div className="space-y-3">
        {Object.entries(PROFESSIONAL_ROLES).map(([key, role]) => {
          const Icon = iconMap[role.icon as keyof typeof iconMap];
          const isSelected = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
                isSelected
                  ? "border-primary-500 bg-primary-50"
                  : "border-neutral-200 hover:border-neutral-300 bg-white"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  isSelected ? "bg-primary-500 text-white" : "bg-neutral-100 text-neutral-500"
                )}
              >
                <Icon size={20} />
              </div>
              <div>
                <p className="font-medium text-neutral-900">{role.label}</p>
                <p className="text-sm text-neutral-500">{role.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selected}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
