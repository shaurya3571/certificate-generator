"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default function OrganizerPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div
          role="status"
          className="text-sm text-gray-600"
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
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Organizer Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              {user.email}
            </p>
          </div>

          <LogoutButton />
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Events
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Participants
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Certificates
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              0
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Certificate Management
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Your events and certificate activity will
            appear here.
          </p>

          <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <p className="text-sm font-medium text-gray-700">
              No events yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Event management will be connected in
              the next step.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}