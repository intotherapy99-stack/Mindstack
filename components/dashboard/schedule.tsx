"use client";

import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Video, MapPin, Phone, Coffee } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Appointment {
  id: string;
  scheduledAt: Date | string;
  duration: number;
  sessionType: string;
  modality: string;
  status: string;
  client?: {
    firstName: string;
    lastName?: string | null;
  } | null;
}

interface Props {
  appointments: Appointment[];
}

const modalityIcons = {
  IN_PERSON: MapPin,
  ONLINE: Video,
  PHONE: Phone,
};

const modalityColors = {
  IN_PERSON: "bg-blue-50 text-blue-600",
  ONLINE: "bg-green-50 text-green-600",
  PHONE: "bg-amber-50 text-amber-600",
};

export function DashboardSchedule({ appointments }: Props) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center mx-auto mb-4">
          <Coffee size={28} className="text-primary-300" />
        </div>
        <p className="text-neutral-600 font-medium">No sessions today</p>
        <p className="text-neutral-400 text-sm mt-1 max-w-xs mx-auto">
          Take some time for yourself — you deserve it
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {appointments.map((apt, idx) => {
        const time = format(new Date(apt.scheduledAt), "h:mm a");
        const Icon =
          modalityIcons[apt.modality as keyof typeof modalityIcons] || MapPin;
        const modalityColor =
          modalityColors[apt.modality as keyof typeof modalityColors] || "bg-neutral-50 text-neutral-600";
        const isPast = new Date(apt.scheduledAt) < new Date();
        const isNext = !isPast && idx === appointments.findIndex(a => new Date(a.scheduledAt) > new Date());

        return (
          <div
            key={apt.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group",
              isPast
                ? "border-neutral-100 bg-neutral-50/50 opacity-50"
                : isNext
                  ? "border-primary-200 bg-primary-50/30 shadow-sm ring-1 ring-primary-100"
                  : "border-neutral-100 hover:border-primary-200 hover:bg-primary-50/20"
            )}
          >
            {/* Time column */}
            <div className="text-center min-w-[56px]">
              <p className={cn(
                "text-sm font-bold tabular-nums",
                isNext ? "text-primary-600" : "text-neutral-900"
              )}>
                {time}
              </p>
              <p className="text-[10px] text-neutral-400 font-medium">{apt.duration}min</p>
            </div>

            {/* Divider line */}
            <div className={cn(
              "w-0.5 h-10 rounded-full",
              isPast ? "bg-neutral-200" : isNext ? "bg-primary-400" : "bg-neutral-200 group-hover:bg-primary-300"
            )} />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-semibold truncate",
                isPast ? "text-neutral-500" : "text-neutral-900"
              )}>
                {apt.client
                  ? `${apt.client.firstName}${apt.client.lastName ? ` ${apt.client.lastName}` : ""}`
                  : "Client session"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium", modalityColor)}>
                  <Icon size={10} />
                  {apt.modality.toLowerCase().replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="shrink-0">
              {isNext ? (
                <Badge variant="active" className="animate-soft-pulse text-[10px]">
                  Up next
                </Badge>
              ) : (
                <Badge
                  variant={
                    apt.status === "CONFIRMED"
                      ? "active"
                      : apt.status === "COMPLETED"
                        ? "default"
                        : "pending"
                  }
                  className="text-[10px]"
                >
                  {apt.status.toLowerCase()}
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
