import { redirect } from "next/navigation";
import { getCurrentUser } from "../../_lib/supabase/auth";
import DashboardShell from "./DashboardShell";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");
  if (user.app_metadata.role !== "admin") redirect("/");

  const metadata = user.user_metadata as {
    display_name?: string;
    full_name?: string;
    name?: string;
  };
  const label =
    metadata.display_name ||
    metadata.full_name ||
    metadata.name ||
    user.email?.split("@")[0] ||
    "مدیر ریگورا";

  return (
    <DashboardShell email={user.email ?? ""} label={label}>
      {children}
    </DashboardShell>
  );
}
