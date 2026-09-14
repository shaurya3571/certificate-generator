"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { downloadCertificate } from "@/lib/certificate/download";
import { groupCertificatesByEvent } from "@/lib/certificate/group";
import { generateCertificate } from "@/lib/certificate/generator";
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

  const [downloadingId, setDownloadingId] =
    useState<string | null>(null);

  const [downloadError, setDownloadError] =
    useState<string | null>(null);

  const [certificatesLoading, setCertificatesLoading] =
    useState(true);

  const [certificatesError, setCertificatesError] =
    useState<string | null>(null);

  const handleDownload = async (
    certificate: ParticipantCertificate,
  ) => {
    setDownloadError(null);
    setDownloadingId(certificate.id);

    try {
      const data = await generateCertificate({
        eventName: certificate.event_name,
        participantName: certificate.participant_name,
        certificateId: certificate.certificate_id,
        template: certificate.template,
      });

      downloadCertificate(data, certificate.file_name);
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Unable to download certificate.",
      );
    } finally {
      setDownloadingId(null);
    }
  };

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
          className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm"
        >
          <p className="text-sm font-semibold text-slate-900">
            Checking your session...
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Please wait a moment.
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const certificateGroups = Object.values(
    groupCertificatesByEvent(certificates),
  );

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

          {downloadError && (
            <div
              role="alert"
              className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
            >
              {downloadError}
            </div>
          )}

          {certificatesLoading && (
            <div
              role="status"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6"
            >
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-3 w-56 rounded bg-slate-200" />
                <div className="h-10 w-full rounded-xl bg-slate-200" />
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Loading certificates...
              </p>
            </div>
          )}

          {certificatesError && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
            >
              <p className="text-sm font-semibold text-red-800">
                Unable to load certificates
              </p>

              <p className="mt-1 text-sm leading-6 text-red-700">
                {certificatesError}
              </p>
            </div>
          )}

          {!certificatesLoading &&
            !certificatesError &&
            certificates.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
                  <span className="text-lg font-bold">
                    —
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-950">
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
              <div className="space-y-8">
                {certificateGroups.map((group) => (
                  <section key={group.eventId} className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-950">
                      {group.eventName}
                    </h3>

                    <div className="space-y-3">
                      {group.certificates.map((certificate) => (
                        <div
                          key={certificate.id}
                          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <h4 className="break-words font-semibold text-slate-950">
                              {certificate.file_name}
                            </h4>

                            <p className="mt-2 break-all text-xs text-slate-500">
                              Certificate ID: {certificate.certificate_id}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleDownload(certificate)
                            }
                            disabled={downloadingId === certificate.id}
                            className="shrink-0 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {downloadingId === certificate.id
                              ? "Preparing..."
                              : "Download"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}