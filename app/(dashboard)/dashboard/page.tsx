import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGreeting, formatINR } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  IndianRupee,
  Clock,
  FileText,
  Plus,
  Search,
  PenLine,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, format } from "date-fns";
import { DashboardSchedule } from "@/components/dashboard/schedule";
import { FaceHeadbandYouth, FaceBunWoman, BlobDecoration1 } from "@/components/inclusive-illustrations";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true, subscription: true },
  });

  if (!user) return null;

  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  // Today's appointments
  const todaysAppointments = await prisma.appointment.findMany({
    where: {
      practitionerId: user.id,
      scheduledAt: { gte: todayStart, lte: todayEnd },
      status: { not: "CANCELLED" },
    },
    include: { client: true },
    orderBy: { scheduledAt: "asc" },
  });

  // This week's revenue
  const weekPayments = await prisma.payment.findMany({
    where: {
      practitionerId: user.id,
      createdAt: { gte: weekStart, lte: weekEnd },
      status: "RECEIVED",
    },
  });
  const weekRevenue = weekPayments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);

  // Supervision hours this month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const supervisionSessions = await prisma.supervisionSession.findMany({
    where: {
      superviseeId: user.id,
      status: "COMPLETED",
      scheduledAt: { gte: monthStart },
    },
  });
  const supervisionHours = supervisionSessions.reduce(
    (sum: number, s: { duration: number }) => sum + s.duration / 60,
    0
  );

  // Pending notes
  const pendingNotes = await prisma.appointment.count({
    where: {
      practitionerId: user.id,
      scheduledAt: { gte: weekStart, lte: now },
      status: "COMPLETED",
      note: null,
    },
  });

  // Next appointment
  const nextAppointment = todaysAppointments.find(
    (a: any) => new Date(a.scheduledAt) > now
  );

  const greeting = getGreeting(
    user.profile?.displayName || user.email.split("@")[0]
  );

  const plan = user.subscription?.plan || "FREE";

  return (
    <div className="max-w-6xl mx-auto page-enter bg-mesh-gradient">
      {/* Greeting banner — hero gradient per DESIGN.md */}
      <div className="mb-5 rounded-2xl bg-hero-gradient p-5 md:p-7 relative overflow-hidden">
        <div className="absolute top-[-40px] right-[-40px] w-[140px] h-[140px] rounded-full bg-primary-container/10" />
        <div className="absolute bottom-[-25px] right-[100px] w-[90px] h-[90px] rounded-full bg-primary-container/8" />
        <div className="absolute top-[50%] right-[10%] w-[20px] h-[20px] rounded-full bg-primary-container/15 animate-float" />
        {/* Diverse face illustrations */}
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden sm:flex items-end gap-1 opacity-20">
          <FaceHeadbandYouth width={56} height={56} className="animate-float" />
          <FaceBunWoman width={48} height={48} className="animate-float-slow" />
        </div>
        <div className="relative z-10">
          <h1 className="font-heading text-xl md:text-2xl font-bold text-white mb-1">
            {greeting}
          </h1>
          {user.profile?.verificationStatus === "PENDING" && (
            <div className="mt-3 bg-white/15 backdrop-blur-sm rounded-xl p-3 text-sm text-white/90 inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-300 rounded-full animate-soft-pulse" />
              Your credentials are being reviewed. Estimated: 48 hours.
            </div>
          )}
          {user.profile?.verificationStatus === "VERIFIED" && (
            <p className="text-primary-100/70 text-sm flex items-center gap-1.5">
              <Sparkles size={14} />
              Verified professional — your profile is live
            </p>
          )}
          {plan === "FREE" && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-primary-200/70 text-xs">Free plan</span>
              <Link href="/settings?tab=billing">
                <span className="text-xs text-white/90 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full transition-colors cursor-pointer">
                  Upgrade
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5 stagger-children">
        {/* Sessions Today */}
        <Card className="card-lift card-press bg-gradient-to-br from-surface-container-low to-surface-container-lowest">
          <CardContent className="p-4">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <Calendar size={18} className="text-primary-500" />
              </div>
              <p className="text-[11px] font-semibold text-primary-600/70 uppercase tracking-wider">
                Today
              </p>
            </div>
            <p className="stat-number">{todaysAppointments.length}</p>
            <p className="text-xs text-neutral-500 mt-0.5">Sessions scheduled</p>
            {nextAppointment && (
              <p className="text-[11px] text-primary-600 mt-2 font-semibold bg-primary-50 px-2 py-1 rounded-lg inline-block">
                Next: {format(new Date(nextAppointment.scheduledAt), "h:mm a")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="card-lift card-press bg-gradient-to-br from-surface-container-low to-surface-container-lowest">
          <CardContent className="p-4">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
                <IndianRupee size={18} className="text-green-600" />
              </div>
              <p className="text-[11px] font-semibold text-green-600/70 uppercase tracking-wider">
                Revenue
              </p>
            </div>
            <p className="stat-number">{formatINR(weekRevenue)}</p>
            <p className="text-xs text-neutral-500 mt-0.5">This week</p>
          </CardContent>
        </Card>

        {/* Supervision */}
        <Card className="card-lift card-press bg-gradient-to-br from-supervision-light to-surface-container-lowest supervision-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-supervision/10 flex items-center justify-center">
                <Clock size={18} className="text-supervision" />
              </div>
              <p className="text-[11px] font-semibold text-supervision/70 uppercase tracking-wider">
                Supervision
              </p>
            </div>
            <p className="stat-number">{supervisionHours.toFixed(1)}h</p>
            <p className="text-xs text-neutral-500 mt-0.5">This month</p>
            <div className="mt-2.5">
              <div className="w-full bg-purple-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-supervision to-purple-400 rounded-full h-1.5 transition-all"
                  style={{ width: `${Math.min((supervisionHours / 12) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-supervision/60 mt-1 font-medium">
                {supervisionHours.toFixed(1)} / 12h quarterly
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Notes */}
        <Card className={`card-lift card-press ${pendingNotes > 0 ? "bg-gradient-to-br from-accent-50 to-surface-container-lowest" : "bg-surface-container-low"}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${pendingNotes > 0 ? "bg-accent-500/10" : "bg-neutral-100"}`}>
                <FileText size={18} className={pendingNotes > 0 ? "text-accent-500" : "text-neutral-400"} />
              </div>
              <p className={`text-[11px] font-semibold uppercase tracking-wider ${pendingNotes > 0 ? "text-accent-500/70" : "text-neutral-400"}`}>
                Notes
              </p>
            </div>
            <p className="stat-number">{pendingNotes}</p>
            <p className="text-xs text-neutral-500 mt-0.5">Pending this week</p>
            {pendingNotes > 0 && (
              <Link href="/notes?action=new" className="block mt-2">
                <span className="text-[11px] text-accent-600 font-semibold bg-accent-50 px-2 py-1 rounded-lg inline-flex items-center gap-1 hover:bg-accent-100 transition-colors">
                  Write now <ArrowRight size={10} />
                </span>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-5">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar size={16} className="text-primary-500" />
                Today&apos;s Schedule
              </CardTitle>
              <Link href="/calendar">
                <Button variant="ghost" size="sm" className="text-xs text-primary-500 gap-1">
                  View Calendar <ArrowRight size={12} />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <DashboardSchedule appointments={todaysAppointments} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { href: "/payments?action=log", icon: IndianRupee, label: "Log a Payment", iconBg: "bg-green-100", iconColor: "text-green-600", hoverBg: "hover:bg-green-50 hover:border-green-200" },
                { href: "/clients?action=new", icon: Plus, label: "Add New Client", iconBg: "bg-primary-100", iconColor: "text-primary-600", hoverBg: "hover:bg-primary-50 hover:border-primary-200" },
                { href: "/supervision", icon: Search, label: "Find a Supervisor", iconBg: "bg-purple-100", iconColor: "text-supervision", hoverBg: "hover:bg-purple-50 hover:border-purple-200" },
                { href: "/notes?action=new", icon: PenLine, label: "Write a Note", iconBg: "bg-amber-100", iconColor: "text-amber-600", hoverBg: "hover:bg-amber-50 hover:border-amber-200" },
              ].map(({ href, icon: Icon, label, iconBg, iconColor, hoverBg }) => (
                <Link key={href} href={href} className="block">
                  <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 active:scale-[0.98] hover:bg-surface-container-low`}>
                    <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
                      <Icon size={15} className={iconColor} />
                    </div>
                    <span className="text-sm font-medium text-neutral-700">{label}</span>
                    <ArrowRight size={14} className="text-neutral-300 ml-auto" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Motivational quote */}
          <Card className="bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-tertiary-container/20 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 opacity-40">
              <BlobDecoration1 width={100} height={100} />
            </div>
            <CardContent className="p-5 text-center relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🌱</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed italic">
                &ldquo;The therapeutic relationship is the most robust predictor of treatment success.&rdquo;
              </p>
              <p className="text-[10px] text-neutral-400 mt-2 font-medium">— Norcross, 2011</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
