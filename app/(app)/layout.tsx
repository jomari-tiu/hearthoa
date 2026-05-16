import { type ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { getSession } from "@/lib/session";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen flex">
      <Sidebar role={session.role} userName={session.name} />
      <main className="flex-1 min-w-0 bg-background">{children}</main>
      <ChatbotWidget />
    </div>
  );
}
