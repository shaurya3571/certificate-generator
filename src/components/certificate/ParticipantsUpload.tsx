"use client";

import { useState } from "react";

import { parseParticipantsCsv } from "@/lib/csv/parser";
import type { Participant } from "@/types/certificate";
import CsvUploader from "./CsvUploader";
import ParticipantPreview from "./ParticipantPreview";

interface ParticipantsUploadProps {
  participants: Participant[];
  onParticipantsChange: (participants: Participant[]) => void;
  onFileChange?: (file: File | null) => void;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
}

export function ParticipantsUpload({
  participants,
  onParticipantsChange,
  onFileChange,
  isAuthenticated,
  onAuthRequired,
}: ParticipantsUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileChange = async (file: File | null) => {
    setFile(file);
    onFileChange?.(file);

    setErrors([]);
    onParticipantsChange([]);

    if (!file) {
      return;
    }

    setIsParsing(true);

    try {
      const result = await parseParticipantsCsv(file);

      onParticipantsChange(result.participants);
      setErrors(result.errors);
    } catch {
      onParticipantsChange([]);
      setErrors(["Unable to process the CSV file."]);
    } finally {
      setIsParsing(false);
    }
  };

  const hasErrors = errors.length > 0;
  const hasParticipants = participants.length > 0;

  return (
    <div className="space-y-6">
      <CsvUploader
        file={file}
        onFileChange={handleFileChange}
        isAuthenticated={isAuthenticated}
        onAuthRequired={onAuthRequired}
      />

      {isParsing && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
          <p className="text-sm text-gray-600">
            Processing participant CSV...
          </p>
        </div>
      )}

      {!isParsing && hasParticipants && !hasErrors && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm font-medium text-emerald-700">
            All {participants.length} participants are valid.
          </p>
        </div>
      )}

      {!isParsing && hasErrors && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-red-600">!</div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-red-800">
                Some rows need attention
              </h3>

              <p className="mt-1 text-sm text-red-700">
                {participants.length > 0
                  ? `${participants.length} valid ${
                      participants.length === 1
                        ? "participant"
                        : "participants"
                    } found.`
                  : "No valid participants found."}
              </p>

              <div className="mt-4 space-y-2">
                {errors.map((error, index) => (
                  <div
                    key={`${error}-${index}`}
                    className="rounded-xl border border-red-100 bg-white px-3 py-2 text-sm text-red-700"
                  >
                    {error}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <ParticipantPreview participants={participants} />

      {!isParsing && !hasParticipants && !hasErrors && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500">
          <p className="text-sm text-gray-500">
            Upload a CSV file to preview participants.
          </p>
        </div>
      )}
    </div>
  );
}

export default ParticipantsUpload;

