import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import { Users, Calendar, IndianRupee, Shield, Clock } from "lucide-react";
import { AdminUserTable } from "@/components/dashboard/admin-users";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [userCount, appointmentCount, supervisionCount, pendingVerifications, totalRevenue] =
    await Promise.all([
      prisma.user.count(),
      prisma.appointment.count(),
      prisma.supervisionSession.count(),
      prisma.profile.count({ where: { verificationStatus: "PENDING" } }),
      prisma.payment.aggregate({
        where: { status: "RECEIVED" },
        _sum: { amount: true },
      }),
    ]);

  const recentUsers = await prisma.user.findMany({
    include: { profile: true, subscription: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">M</span>
            </div>
            <span className="font-heading font-bold text-lg text-neutral-900">
              MindStack Admin
            </span>
          </div>
          <Badge variant="error">Admin Panel</Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="font-heading text-2xl font-bold text-neutral-900 mb-6">
          Platform Overview
        </h1>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Users size={20} className="text-primary-500" />
              <div>
                <p className="text-2xl font-bold">{userCount}</p>
                <p className="text-xs text-neutral-500">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Calendar size={20} className="text-primary-500" />
              <div>
                <p className="text-2xl font-bold">{appointmentCount}</p>
                <p className="text-xs text-neutral-500">Appointments</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Clock size={20} className="text-supervision" />
              <div>
                <p className="text-2xl font-bold">{supervisionCount}</p>
                <p className="text-xs text-neutral-500">Supervision Sessions</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Shield size={20} className="text-amber-500" />
              <div>
                <p className="text-2xl font-bold">{pendingVerifications}</p>
                <p className="text-xs text-neutral-500">Pending Verifications</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <IndianRupee size={20} className="text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {formatINR(totalRevenue._sum.amount || 0)}
                </p>
                <p className="text-xs text-neutral-500">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({userCount})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AdminUserTable users={recentUsers} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
