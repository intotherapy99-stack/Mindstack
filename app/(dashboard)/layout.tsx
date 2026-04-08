import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/shared/sidebar";
import { MobileNav } from "@/components/shared/mobile-nav";
import { DashboardShell } from "@/components/shared/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Redirect client users to their portal
  if ((session.user as any).userType === "CLIENT") {
    redirect("/my-care");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <DashboardShell user={session.user}>
        {children}
      </DashboardShell>
      <MobileNav />
    </div>
  );
}
