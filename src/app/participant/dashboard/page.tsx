"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { LogoutButton } from "@/components/auth/LogoutButton";
import PageContainer from "@/components/layout/PageContainer";

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
      <PageContainer>
        <div
          role="status"
          className="flex min-h-[calc(100vh-170px)] items-center justify-center"
        >
          <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            Checking your session...
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Participant portal
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Participant Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Signed in as {user.email}
            </p>
          </div>

          <LogoutButton redirectTo="/participant/login" />
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-950">
            Your certificates
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Certificates associated with your account will appear here.
          </p>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
            <p className="text-sm font-semibold text-slate-700">
              No certificates yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Your certificates will appear here when they are available.
            </p>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}