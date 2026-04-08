"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingBasicSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INDIAN_STATES } from "@/lib/constants";

interface Props {
  data: Record<string, any>;
  onNext: (data: Record<string, any>) => void;
}

export function StepBasicInfo({ data, onNext }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingBasicSchema),
    defaultValues: {
      displayName: data.displayName || "",
      city: data.city || "",
      state: data.state || "",
      yearsExperience: data.yearsExperience || undefined,
    },
  });

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-neutral-900 mb-1">
        Tell us about yourself
      </h2>
      <p className="text-sm text-neutral-500 mb-6">
        Basic info to set up your professional profile
      </p>

      <form onSubmit={handleSubmit(onNext)} className="space-y-4">
        <div>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            placeholder="Dr. Priya Sharma"
            {...register("displayName")}
            className="mt-1.5"
          />
          {errors.displayName && (
            <p className="text-error text-xs mt-1">
              {errors.displayName.message as string}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Mumbai"
            {...register("city")}
            className="mt-1.5"
          />
          {errors.city && (
            <p className="text-error text-xs mt-1">
              {errors.city.message as string}
            </p>
          )}
        </div>

        <div>
          <Label>State</Label>
          <Select
            defaultValue={data.state}
            onValueChange={(val) => setValue("state", val)}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <p className="text-error text-xs mt-1">
              {errors.state.message as string}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="yearsExperience">Years of Experience</Label>
          <Input
            id="yearsExperience"
            type="number"
            min={0}
            max={60}
            placeholder="e.g. 5"
            {...register("yearsExperience")}
            className="mt-1.5"
          />
        </div>

        <Button type="submit" className="w-full mt-6">
          Continue
        </Button>
      </form>
    </div>
  );
}
