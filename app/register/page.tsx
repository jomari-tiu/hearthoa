import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/app/_components/Logo";
import { RegisterForm } from "@/app/_components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]">
      <section className="hidden lg:flex flex-col justify-between p-10 bg-surface border-r border-border">
        <Logo />
        <div className="max-w-md flex flex-col gap-5">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-primary">
            Join the community portal
          </p>
          <h1 className="text-3xl font-semibold tracking-tight leading-tight text-foreground">
            Get registered so your board can verify you live here.
          </h1>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Submit your information, and an HOA admin will activate your account within a day or two. You&apos;ll get an email when it&apos;s ready.
          </p>
          <ul className="text-sm text-foreground-muted leading-relaxed flex flex-col gap-1.5">
            <li>· The board verifies you against the unit roster before approving.</li>
            <li>· Your password is hashed; we never email it back.</li>
            <li>· You can change your notification preferences once you&apos;re in.</li>
          </ul>
        </div>
        <p className="text-xs text-foreground-subtle">© {new Date().getFullYear()} HearthHOA</p>
      </section>

      <section className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm mx-auto flex flex-col gap-6">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Request access</h2>
            <p className="mt-1 text-sm text-foreground-muted">
              Already a member?{" "}
              <Link href="/" className="text-primary hover:underline">Sign in</Link>.
            </p>
          </div>
          <Suspense fallback={<div className="h-64 rounded-lg bg-surface-2 animate-pulse" />}>
            <RegisterForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
