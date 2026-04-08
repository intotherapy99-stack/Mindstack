"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  data: Record<string, any>;
  onComplete: (data: Record<string, any>) => void;
  onBack: () => void;
  loading: boolean;
}

export function StepSupervision({ data, onComplete, onBack, loading }: Props) {
  const [offersSupervision, setOffersSupervision] = useState(
    data.offersSupervision || false
  );
  const [supervisionFee, setSupervisionFee] = useState(
    data.supervisionFee || ""
  );
  const [supervisionModality, setSupervisionModality] = useState(
    data.supervisionModality || ""
  );
  const [supervisionApproach, setSupervisionApproach] = useState(
    data.supervisionApproach || ""
  );
  const [maxSuperviseesCount, setMaxSuperviseesCount] = useState(
    data.maxSuperviseesCount || 5
  );

  function handleSubmit() {
    onComplete({
      offersSupervision,
      ...(offersSupervision
        ? {
            supervisionFee: Number(supervisionFee),
            supervisionModality,
            supervisionApproach,
            maxSuperviseesCount: Number(maxSuperviseesCount),
          }
        : {}),
    });
  }

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-neutral-900 mb-1">
        Clinical Supervision
      </h2>
      <p className="text-sm text-neutral-500 mb-6">
        Are you available to supervise junior professionals? You can change this
        anytime.
      </p>

      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg mb-6">
        <div>
          <p className="font-medium text-neutral-900">
            I offer clinical supervision
          </p>
          <p className="text-sm text-neutral-500">
            You&apos;ll appear in the supervisor directory
          </p>
        </div>
        <Switch
          checked={offersSupervision}
          onCheckedChange={setOffersSupervision}
        />
      </div>

      {offersSupervision && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="supervisionFee">Session Fee (INR)</Label>
            <Input
              id="supervisionFee"
              type="number"
              min={800}
              max={5000}
              placeholder="e.g. 1800"
              value={supervisionFee}
              onChange={(e) => setSupervisionFee(e.target.value)}
              className="mt-1.5"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Suggested range: ₹800 - ₹5,000 per session
            </p>
          </div>

          <div>
            <Label>Modality</Label>
            <Select
              value={supervisionModality}
              onValueChange={setSupervisionModality}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select modality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ONLINE">Online</SelectItem>
                <SelectItem value="IN_PERSON">In-Person</SelectItem>
                <SelectItem value="HYBRID">Both (Hybrid)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="supervisionApproach">
              Your Supervision Approach
            </Label>
            <Textarea
              id="supervisionApproach"
              placeholder="e.g. I use a Socratic method focused on developing clinical reasoning..."
              value={supervisionApproach}
              onChange={(e) => setSupervisionApproach(e.target.value)}
              className="mt-1.5"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-neutral-400 mt-1 text-right">
              {supervisionApproach.length}/500
            </p>
          </div>

          <div>
            <Label htmlFor="maxSuperviseesCount">
              Maximum Number of Supervisees
            </Label>
            <Input
              id="maxSuperviseesCount"
              type="number"
              min={1}
              max={20}
              value={maxSuperviseesCount}
              onChange={(e) => setMaxSuperviseesCount(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1"
        >
          {loading ? "Setting up..." : "Complete Setup"}
        </Button>
      </div>
    </div>
  );
}
