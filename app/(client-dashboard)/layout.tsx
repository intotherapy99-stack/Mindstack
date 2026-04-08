import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ClientDashboardShell } from "@/components/client/client-dashboard-shell";

export default async function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Redirect professional users to their dashboard
  if ((session.user as any).userType !== "CLIENT") {
    redirect("/dashboard");
  }

  return <ClientDashboardShell user={session.user}>{children}</ClientDashboardShell>;
}
