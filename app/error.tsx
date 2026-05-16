"use client";

import { Button } from "@/components/ds";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-10">
      <div className="max-w-md flex flex-col items-start gap-4">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-danger">Something went wrong</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">We hit a snag rendering this page.</h1>
        <p className="text-sm text-foreground-muted">
          {error.message || "Try again, and if it keeps happening let your board administrator know."}
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
