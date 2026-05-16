import { Suspense } from "react";
import { Logo } from "@/app/_components/Logo";
import { ResetPasswordForm } from "@/app/_components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <Logo />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Set a new password</h1>
        <Suspense fallback={<div className="h-40 rounded-lg bg-surface-2 animate-pulse" />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
