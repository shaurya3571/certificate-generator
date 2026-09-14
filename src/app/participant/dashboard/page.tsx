"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { LogoutButton } from "@/components/auth/LogoutButton";
import {
  getParticipantCertificates,
} from "@/lib/supabase/participant-certificates";

import type {
  ParticipantCertificate,
} from "@/types/database";

export default function ParticipantDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [certificates, setCertificates] =
    useState<ParticipantCertificate[]>([]);

  const [certificatesLoading, setCertificatesLoading] =
    useState(true);

  const [certificatesError, setCertificatesError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/participant/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user?.email) {
      return;
    }

    const userEmail = user.email;

    const loadCertificates = async () => {
      setCertificatesLoading(true);
      setCertificatesError(null);

      try {
        const participantCertificates =
          await getParticipantCertificates(
            userEmail,
          );

        setCertificates(
          participantCertificates,
        );
      } catch (error) {
        setCertificatesError(
          error instanceof Error
            ? error.message
            : "Unable to load certificates.",
        );
      } finally {
        setCertificatesLoading(false);
      }
    };

    loadCertificates();
  }, [user]);

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

          {certificatesLoading && (
            <div
              role="status"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600"
            >
              Loading certificates...
            </div>
          )}

          {certificatesError && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {certificatesError}
            </div>
          )}

          {!certificatesLoading &&
            !certificatesError &&
            certificates.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <h3 className="text-sm font-semibold text-slate-950">
                  No certificates yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Certificates issued to your email address will appear here.
                </p>
              </div>
            )}

          {!certificatesLoading &&
            !certificatesError &&
            certificates.length > 0 && (
              <div className="space-y-3">
                {certificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <p className="text-sm font-semibold text-slate-500">
                      {certificate.event_name}
                    </p>

                    <h3 className="mt-1 font-bold text-slate-950">
                      {certificate.file_name}
                    </h3>

                    <p className="mt-2 text-xs text-slate-500">
                      Certificate ID:{" "}
                      {certificate.certificate_id}
                    </p>
                  </div>
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}