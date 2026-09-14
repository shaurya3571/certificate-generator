"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default function ParticipantDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/participant/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div
          role="status"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600"
        >
          Checking your session...
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Participant portal
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Your certificates
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              View and download certificates associated with your account.
            </p>
          </div>

          <LogoutButton redirectTo="/participant/login" />
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Account
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950">
                Signed in
              </h2>

              <p className="mt-2 break-all text-sm text-slate-600">
                {user.email}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-950">
                Active
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-500">
              Certificate library
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              Your certificates
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Certificates issued to this email address will appear here.
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <h3 className="text-sm font-semibold text-slate-950">
              No certificates yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Once a certificate is issued to your email address, it will appear in this section.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}