"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, MapPin, CheckCircle2, Clock } from "lucide-react";

interface SupervisionSession {
  id: string;
  scheduledAt: string;
  duration: number;
  modality: string;
  status: string;
  logCompleted: boolean;
  supervisor: {
    profile?: { displayName: string; avatarUrl: string | null } | null;
  };
  supervisee: {
    profile?: { displayName: string; avatarUrl: string | null } | null;
  };
}

export default function MySessionsPage() {
  const [sessions, setSessions] = useState<SupervisionSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/supervision/sessions")
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
        setLoading(false);
      });
  }, []);

  const upcoming = sessions.filter(
    (s) => s.status === "CONFIRMED" || s.status === "PENDING"
  );
  const past = sessions.filter(
    (s) => s.status === "COMPLETED" || s.status === "CANCELLED" || s.status === "NO_SHOW"
  );

  return (
    <div className="max-w-4xl mx-auto page-enter">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">
          My Sessions
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Manage your sessions and logs
        </p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {loading ? (
            <Card className="animate-pulse">
              <CardContent className="h-24" />
            </Card>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-12">
              <Clock size={32} className="text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500">No upcoming sessions</p>
              <p className="text-sm text-neutral-400 mt-1">
                Book a session from the supervisor directory
              </p>
            </div>
          ) : (
            upcoming.map((session) => (
              <SessionCard key={session.id} session={session} type="upcoming" />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-3 mt-4">
          {past.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-500">No past sessions yet</p>
            </div>
          ) : (
            past.map((session) => (
              <SessionCard key={session.id} session={session} type="past" />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SessionCard({
  session,
  type,
}: {
  session: SupervisionSession;
  type: "upcoming" | "past";
}) {
  const supervisorName =
    session.supervisor.profile?.displayName || "Supervisor";
  const initials = supervisorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={session.supervisor.profile?.avatarUrl ?? undefined}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-neutral-900">{supervisorName}</p>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
            <span>
              {format(new Date(session.scheduledAt), "MMM d, yyyy · h:mm a")}
            </span>
            <span>·</span>
            <span>{session.duration} min</span>
            <span>·</span>
            <div className="flex items-center gap-0.5">
              {session.modality === "ONLINE" ? (
                <Video size={11} />
              ) : (
                <MapPin size={11} />
              )}
              <span className="capitalize">
                {session.modality.toLowerCase().replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              session.status === "CONFIRMED"
                ? "active"
                : session.status === "COMPLETED"
                  ? "verified"
                  : session.status === "PENDING"
                    ? "pending"
                    : "error"
            }
          >
            {session.status.toLowerCase()}
          </Badge>
          {type === "past" && session.status === "COMPLETED" && (
            session.logCompleted ? (
              <CheckCircle2 size={16} className="text-green-500" />
            ) : (
              <Button size="sm" variant="supervision">
                Write Log
              </Button>
            )
          )}
          {type === "upcoming" && (
            <Button size="sm" variant="secondary">
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
