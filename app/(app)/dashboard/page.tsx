import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { AdminDashboard } from "./_components/AdminDashboard";
import { ResidentDashboard } from "./_components/ResidentDashboard";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/");
  return session.role === "admin" ? <AdminDashboard /> : <ResidentDashboard userName={session.name} />;
}
