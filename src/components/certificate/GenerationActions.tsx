"use client";

import { useState } from "react";

import { generateBulkCertificates } from "@/lib/certificate/bulk-generator";
import { createCertificatesZip } from "@/lib/certificate/zip";
import type {
  Participant,
  TemplateType,
} from "@/types/certificate";

interface GenerationActionsProps {
  eventName: string;
  template: TemplateType | null;
  participants: Participant[];
}

type GenerationStatus =
  | "idle"
  | "generating"
  | "success"
  | "error";

export function GenerationActions({
  eventName,
  template,
  participants,
}: GenerationActionsProps) {
  const [status, setStatus] =
    useState<GenerationStatus>("idle");

  const [generationError, setGenerationError] =
    useState<string | null>(null);

  const [generatedZip, setGeneratedZip] =
    useState<Uint8Array | null>(null);

  const canGenerate =
    eventName.trim().length > 0 &&
    template !== null &&
    template !== "custom" &&
    participants.length > 0;

  const handleGenerate = async () => {
    if (!canGenerate || !template) {
      return;
    }

    setStatus("generating");
    setGenerationError(null);
    setGeneratedZip(null);

    try {
      const certificates =
        await generateBulkCertificates({
          eventName: eventName.trim(),
          template,
          participants,
        });

      if (certificates.length === 0) {
        throw new Error(
          "No certificates were generated.",
        );
      }

      const zip = await createCertificatesZip(
        certificates,
      );

      setGeneratedZip(zip);
      setStatus("success");
    } catch (error) {
      console.error(
        "Certificate generation failed:",
        error,
      );

      setGeneratedZip(null);
      setGenerationError(
        error instanceof Error
          ? error.message
          : "Unable to generate certificates. Please try again.",
      );

      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!generatedZip) {
      return;
    }
 const arrayBuffer = generatedZip.buffer.slice(
  generatedZip.byteOffset,
  generatedZip.byteOffset + generatedZip.byteLength,
) as ArrayBuffer;

const blob = new Blob([arrayBuffer], {
  type: "application/zip",
});


    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "certificates.zip";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setStatus("idle");
    setGenerationError(null);
    setGeneratedZip(null);
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={!canGenerate || status === "generating"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {status === "generating" && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            aria-hidden="true"
          />
        )}

        {status === "generating"
          ? "Generating certificates..."
          : "Generate Certificates"}
      </button>

      {status === "generating" && (
        <div
          role="status"
          className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
        >
          <p className="text-sm font-medium text-gray-700">
            Generating {participants.length}{" "}
            {participants.length === 1
              ? "certificate"
              : "certificates"}
            ...
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Please keep this page open until generation
            finishes.
          </p>
        </div>
      )}

      {status === "success" && generatedZip && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <span
              className="text-green-600"
              aria-hidden="true"
            >
              ✓
            </span>

            <div>
              <p className="text-sm font-semibold text-green-800">
                Certificates generated successfully.
              </p>

              <p className="mt-1 text-sm text-green-700">
                {participants.length}{" "}
                {participants.length === 1
                  ? "certificate is"
                  : "certificates are"}{" "}
                ready to download.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Download ZIP
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Generate Again
            </button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <div className="flex items-start gap-3">
            <span
              className="text-red-600"
              aria-hidden="true"
            >
              !
            </span>

            <div>
              <p className="text-sm font-semibold text-red-800">
                Certificate generation failed
              </p>

              <p className="mt-1 text-sm text-red-700">
                {generationError}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}