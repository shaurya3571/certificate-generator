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
}

export default function ParticipantsUpload({
  participants,
  onParticipantsChange,
  onFileChange,
}: ParticipantsUploadProps) { 
  const [errors, setErrors] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileChange = async (file: File | null) => {
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

  return (
    <div className="space-y-6">
      <CsvUploader 
        file={null}
        onFileChange={handleFileChange} />

      {isParsing && (
        <p className="text-sm text-gray-500">
          Processing participant CSV...
        </p>
      )}

      {errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="mb-2 text-sm font-semibold text-red-700">
            Please check your CSV
          </p>

          <ul className="space-y-1 text-sm text-red-600">
            {errors.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <ParticipantPreview participants={participants} />
    </div>
  );
}