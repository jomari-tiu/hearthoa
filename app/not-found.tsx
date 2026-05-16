import Link from "next/link";
import { Button } from "@/components/ds";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-10">
      <div className="max-w-md flex flex-col items-start gap-4">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-foreground-subtle">404</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">This page isn&apos;t in our community.</h1>
        <p className="text-sm text-foreground-muted">The link may be old or you might not have access.</p>
        <Button asChild>
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
