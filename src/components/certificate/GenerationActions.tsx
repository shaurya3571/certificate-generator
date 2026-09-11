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

export function GenerationActions({
  eventName,
  template,
  participants,
}: GenerationActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
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

    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedZip(null);

    try {
      const certificates =
        await generateBulkCertificates({
          eventName: eventName.trim(),
          template,
          participants,
        });

      const zip = await createCertificatesZip(
        certificates,
      );

      setGeneratedZip(zip);
    } catch (error) {
      console.error(
        "Certificate generation failed:",
        error,
      );

      setGenerationError(
        "Unable to generate certificates. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={!canGenerate || isGenerating}
        className="w-full rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isGenerating
          ? "Generating certificates..."
          : "Generate Certificates"}
      </button>

      {generationError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">
            {generationError}
          </p>
        </div>
      )}

      {generatedZip && !isGenerating && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm font-medium text-green-700">
            ✓ Certificates generated successfully.
          </p>
        </div>
      )}
    </div>
  );
}