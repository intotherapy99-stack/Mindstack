"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, AlertCircle, Pill, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Prescription {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileName: string;
  fileType: string;
  createdAt: string;
  practitionerName: string | null;
}

function fileTypeBadge(type: string) {
  switch (type?.toUpperCase()) {
    case "PDF":
      return "bg-red-50 text-red-600 border-red-200";
    case "IMAGE":
      return "bg-blue-50 text-blue-600 border-blue-200";
    default:
      return "bg-neutral-50 text-neutral-600 border-neutral-200";
  }
}

export default function MyPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/client-dashboard/prescriptions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load prescriptions");
        return res.json();
      })
      .then(setPrescriptions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-enter">
        <div className="skeleton h-7 w-48 rounded-lg mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-enter">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle size={32} className="text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 mb-4">Could not load your prescriptions.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <h1 className="font-heading text-xl font-bold text-neutral-900 mb-4">
        My Prescriptions
      </h1>

      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <Pill size={40} className="text-neutral-300 mx-auto mb-3" />
            <p className="font-medium text-neutral-700 mb-1">No prescriptions yet</p>
            <p className="text-sm text-neutral-500">
              Prescriptions shared by your practitioner will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((rx) => (
            <Card key={rx.id} className="card-lift card-press">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Pill size={16} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-heading text-sm font-bold text-neutral-900">
                          {rx.title}
                        </p>
                        {rx.description && (
                          <p className="text-xs text-neutral-600 mt-0.5 line-clamp-2">
                            {rx.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${fileTypeBadge(rx.fileType)}`}
                      >
                        {rx.fileType}
                      </span>
                    </div>
                    {rx.practitionerName && (
                      <p className="text-xs text-neutral-500 mt-1 truncate">
                        {rx.practitionerName}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(rx.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText size={10} />
                          {rx.fileName}
                        </span>
                      </div>
                      <a
                        href={rx.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                          <ExternalLink size={12} />
                          View
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
