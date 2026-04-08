"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
}

const REGISTRATION_LABELS: Record<string, { label: string; placeholder: string }> = {
  CLINICAL_PSYCHOLOGIST: { label: "RCI / State Registration Number", placeholder: "e.g. A12345" },
  COUNSELOR: { label: "Registration / Membership Number", placeholder: "e.g. Membership ID" },
  THERAPIST: { label: "Registration / Certification Number", placeholder: "e.g. Certificate ID" },
  PSYCHIATRIST: { label: "NMC / State Medical Council Number", placeholder: "e.g. NMC-12345" },
  STUDENT_TRAINEE: { label: "University / Institute ID", placeholder: "e.g. Student ID" },
};

export function StepCredentials({ data, onNext, onBack }: Props) {
  const [regNumber, setRegNumber] = useState(data.rciNumber || data.nmcNumber || "");
  const [fileName, setFileName] = useState<string | null>(null);

  const role = data.role;
  const regInfo = REGISTRATION_LABELS[role] || {
    label: "Registration / License Number",
    placeholder: "e.g. Your registration ID",
  };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // In production, upload to Cloudinary here
    }
  }

  function handleSubmit() {
    const isNmc = role === "PSYCHIATRIST";
    onNext({
      rciNumber: !isNmc ? regNumber : undefined,
      nmcNumber: isNmc ? regNumber : undefined,
      credentialDoc: fileName,
    });
  }

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-neutral-900 mb-1">
        Your credentials
      </h2>
      <p className="text-sm text-neutral-500 mb-6">
        Add your professional credentials for verification. This earns you a
        verified badge on your profile. All fields are optional.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="regNumber">{regInfo.label} (optional)</Label>
          <Input
            id="regNumber"
            placeholder={regInfo.placeholder}
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            className="mt-1.5"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Provide your professional registration number if applicable
          </p>
        </div>

        <div>
          <Label>Degree Certificate / License Document (optional)</Label>
          <div className="mt-1.5 border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="credential-upload"
            />
            <label
              htmlFor="credential-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload size={24} className="text-neutral-400 mb-2" />
              {fileName ? (
                <p className="text-sm text-primary-600 font-medium">
                  {fileName}
                </p>
              ) : (
                <>
                  <p className="text-sm font-medium text-neutral-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    PDF, JPG, or PNG up to 5MB
                  </p>
                </>
              )}
            </label>
          </div>
        </div>
      </div>

      <p className="text-xs text-neutral-400 mt-4">
        Your documents are encrypted and only visible to you and our
        verification team. We comply with the DPDP Act.
      </p>

      <div className="flex gap-3 mt-6">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={handleSubmit} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}
