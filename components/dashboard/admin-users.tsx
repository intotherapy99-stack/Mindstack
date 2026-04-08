"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  phone: string | null;
  createdAt: string | Date;
  profile?: {
    displayName: string;
    role: string;
    city: string;
    verificationStatus: string;
  } | null;
  subscription?: {
    plan: string;
  } | null;
}

export function AdminUserTable({ users }: { users: AdminUser[] }) {
  const [verifying, setVerifying] = useState<string | null>(null);

  async function handleVerify(userId: string, action: "VERIFIED" | "REJECTED") {
    setVerifying(userId);
    await fetch(`/api/admin/users/${userId}/verify`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action }),
    });
    window.location.reload();
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50">
            <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">
              User
            </th>
            <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">
              Role
            </th>
            <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">
              City
            </th>
            <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">
              Plan
            </th>
            <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">
              Verification
            </th>
            <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">
              Joined
            </th>
            <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
            >
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-neutral-900">
                  {user.profile?.displayName || "—"}
                </p>
                <p className="text-xs text-neutral-400">{user.email}</p>
              </td>
              <td className="px-4 py-3 text-sm text-neutral-600 capitalize">
                {user.profile?.role?.toLowerCase().replace("_", " ") || "—"}
              </td>
              <td className="px-4 py-3 text-sm text-neutral-600">
                {user.profile?.city || "—"}
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    user.subscription?.plan === "FREE" ? "unverified" : "active"
                  }
                >
                  {user.subscription?.plan || "FREE"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    user.profile?.verificationStatus === "VERIFIED"
                      ? "verified"
                      : user.profile?.verificationStatus === "PENDING"
                        ? "pending"
                        : "unverified"
                  }
                >
                  {user.profile?.verificationStatus?.toLowerCase() || "—"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-xs text-neutral-400">
                {format(new Date(user.createdAt), "MMM d, yyyy")}
              </td>
              <td className="px-4 py-3">
                {user.profile?.verificationStatus === "PENDING" && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleVerify(user.id, "VERIFIED")}
                      disabled={verifying === user.id}
                    >
                      <CheckCircle2 size={14} className="text-green-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleVerify(user.id, "REJECTED")}
                      disabled={verifying === user.id}
                    >
                      <XCircle size={14} className="text-red-500" />
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
