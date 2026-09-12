"use client";

import { useState } from "react";

import type {
  Participant,
  TemplateType,
} from "@/types/certificate";

interface EmailActionsProps {
  eventName: string;
  template: TemplateType | null;
  participants: Participant[];
}

interface EmailResult {
  participant: Participant;
  certificateId?: string;
  success: boolean;
  error?: string;
}

interface BulkEmailResponse {
  success: boolean;
  total: number;
  successful: number;
  failed: number;
  results: EmailResult[];
}

type EmailStatus =
  | "idle"
  | "sending"
  | "success"
  | "partial"
  | "error";

export function EmailActions({
  eventName,
  template,
  participants,
}: EmailActionsProps) {
  const [status, setStatus] =
    useState<EmailStatus>("idle");

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [result, setResult] =
    useState<BulkEmailResponse | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const canSend =
    eventName.trim().length > 0 &&
    template !== null &&
    template !== "custom" &&
    participants.length > 0;

  const handleSendEmails = async () => {
    if (!canSend || !template) {
      return;
    }

    setStatus("sending");
    setCurrentIndex(0);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(
        "/api/email/send-bulk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventName: eventName.trim(),
            template,
            participants: participants.map((participant) => ({
              participant,
            })),
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.error ??
            "Unable to send certificate emails.",
        );
      }

      const data =
        (await response.json()) as BulkEmailResponse;

      setResult(data);

      if (data.failed === 0) {
        setStatus("success");
      } else if (data.successful > 0) {
        setStatus("partial");
      } else {
        setStatus("error");
      }

      setCurrentIndex(data.total);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send certificate emails.",
      );

      setStatus("error");
    }
  };

  const handleRetryFailed = async () => {
    if (!template || !result) {
      return;
    }

    const failedParticipants = result.results
      .filter((item) => !item.success)
      .map((item) => ({
        participant: item.participant,
        certificateId: item.certificateId,
      }));

    if (failedParticipants.length === 0) {
      return;
    }

    setStatus("sending");
    setCurrentIndex(0);
    setError(null);

    try {
      const response = await fetch(
        "/api/email/send-bulk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventName: eventName.trim(),
            template,
            participants: failedParticipants,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.error ??
            "Unable to retry failed certificate emails.",
        );
      }

      const retryData =
        (await response.json()) as BulkEmailResponse;

      const mergedResults = result.results.map(
        (original) => {
          const retryResult =
            retryData.results.find(
              (retry) =>
                retry.participant.email ===
                original.participant.email,
            );

          return retryResult
            ? retryResult
            : original;
        },
      );

      const mergedResult: BulkEmailResponse = {
        success: mergedResults.every(
          (item) => item.success,
        ),
        total: mergedResults.length,
        successful: mergedResults.filter(
          (item) => item.success,
        ).length,
        failed: mergedResults.filter(
          (item) => !item.success,
        ).length,
        results: mergedResults,
      };

      setResult(mergedResult);
      setCurrentIndex(failedParticipants.length);

      if (mergedResult.failed === 0) {
        setStatus("success");
      } else if (mergedResult.successful > 0) {
        setStatus("partial");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to retry failed certificate emails.",
      );

      setStatus("error");
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleSendEmails}
        disabled={
          !canSend || status === "sending"
        }
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        {status === "sending" && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"
            aria-hidden="true"
          />
        )}

        {status === "sending"
          ? "Sending certificates..."
          : "Send Certificates by Email"}
      </button>

      {status === "sending" && (
        <div
          role="status"
          className="rounded-xl border border-gray-200 bg-gray-50 p-4"
        >
          <p className="text-sm font-semibold text-gray-800">
            Sending certificates
          </p>

          <p className="mt-1 text-sm text-gray-600">
            Processing {currentIndex + 1} of{" "}
            {participants.length}...
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gray-800 transition-all"
              style={{
                width: `${Math.min(
                  ((currentIndex + 1) /
                    participants.length) *
                    100,
                  100,
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {status === "success" && result && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-800">
            ✓ All certificates sent successfully.
          </p>

          <p className="mt-1 text-sm text-green-700">
            {result.successful}{" "}
            {result.successful === 1
              ? "certificate"
              : "certificates"}{" "}
            sent.
          </p>
        </div>
      )}

      {status === "partial" && result && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm font-semibold text-yellow-800">
            Some certificates could not be sent.
          </p>

          <p className="mt-1 text-sm text-yellow-700">
            {result.successful} sent ·{" "}
            {result.failed} failed
          </p>

          <div className="mt-4 space-y-2">
            {result.results
              .filter((item) => !item.success)
              .map((item, index) => (
                <div
                  key={`${item.participant.email}-${index}`}
                  className="rounded-lg border border-yellow-200 bg-white px-3 py-2"
                >
                  <p className="text-sm font-medium text-gray-800">
                    {item.participant.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {item.participant.email}
                  </p>

                  <p className="mt-1 text-xs text-red-600">
                    {item.error ??
                      "Unable to send certificate."}
                  </p>
                </div>
              ))}
          </div>

          <button
            type="button"
            onClick={handleRetryFailed}
            className="mt-4 rounded-lg border border-yellow-300 bg-white px-4 py-2 text-sm font-semibold text-yellow-800 transition hover:bg-yellow-50"
          >
            Retry Failed Emails
          </button>
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <p className="text-sm font-semibold text-red-800">
            Certificate emails could not be sent.
          </p>

          <p className="mt-1 text-sm text-red-700">
            {error ??
              "Please check the email configuration and try again."}
          </p>

          <button
            type="button"
            onClick={handleSendEmails}
            className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}