import { Suspense } from "react";
import { Logo } from "./_components/Logo";
import { LoginForm } from "./_components/LoginForm";

export default function LandingPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]">
      <section className="hidden lg:flex flex-col justify-between p-10 bg-surface border-r border-border">
        <Logo />
        <div className="max-w-md flex flex-col gap-6">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-primary">
            Your community, organized
          </p>
          <h1 className="text-3xl font-semibold tracking-tight leading-tight text-foreground">
            Announcements, dues, documents, and a chatbot that answers from your CC&amp;Rs — all in one quiet place.
          </h1>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Built for volunteer boards and the residents who count on them. No noise, no upsells.
          </p>
        </div>
        <p className="text-xs text-foreground-subtle">© {new Date().getFullYear()} HearthHOA</p>
      </section>

      <section className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm mx-auto flex flex-col gap-8">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h2>
            <p className="mt-1 text-sm text-foreground-muted">
              Use the email on file with your board. New here? Ask an admin to invite you.
            </p>
          </div>
          <Suspense fallback={<div className="h-40 rounded-lg bg-surface-2 animate-pulse" />}>
            <LoginForm />
          </Suspense>
          <p className="text-xs text-foreground-subtle">
            Forgot your password? Contact your board administrator. Self-serve password reset arrives in Sprint 1.
          </p>
        </div>
      </section>
    </main>
  );
}
