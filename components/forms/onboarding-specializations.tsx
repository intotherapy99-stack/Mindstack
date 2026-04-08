"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SPECIALIZATIONS, THERAPY_MODALITIES } from "@/lib/constants";

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
}

export function StepSpecializations({ data, onNext, onBack }: Props) {
  const [specializations, setSpecializations] = useState<string[]>(
    data.specializations || []
  );
  const [modalities, setModalities] = useState<string[]>(
    data.modalities || []
  );

  function toggleItem(list: string[], setList: (v: string[]) => void, item: string) {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  }

  function handleSubmit() {
    if (specializations.length === 0) return;
    onNext({ specializations, modalities });
  }

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-neutral-900 mb-1">
        Your specializations
      </h2>
      <p className="text-sm text-neutral-500 mb-6">
        Select the areas you work with. This helps supervisees and colleagues
        find you.
      </p>

      <div className="mb-6">
        <p className="text-sm font-medium text-neutral-700 mb-3">
          Presenting Concerns
        </p>
        <div className="flex flex-wrap gap-2">
          {SPECIALIZATIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleItem(specializations, setSpecializations, item)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                specializations.includes(item)
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-neutral-600 border-neutral-300 hover:border-primary-300"
              )}
            >
              {item}
            </button>
          ))}
        </div>
        {specializations.length === 0 && (
          <p className="text-xs text-neutral-400 mt-2">
            Select at least one specialization
          </p>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-neutral-700 mb-3">
          Therapy Modalities
        </p>
        <div className="flex flex-wrap gap-2">
          {THERAPY_MODALITIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleItem(modalities, setModalities, item)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                modalities.includes(item)
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-neutral-600 border-neutral-300 hover:border-primary-300"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={specializations.length === 0}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
