"use client";

import CsvUploader from "@/components/certificate/CsvUploader";
import ParticipantPreview from "@/components/certificate/ParticipantPreview";
import type { Participant } from "@/types/certificate";

interface ParticipantsUploadProps {
  file: File | null;
  participants: Participant[];
  onFileChange: (file: File | null) => void;
  onParticipantsChange: (participants: Participant[]) => void;
}

export default function ParticipantsUpload({
  file,
  participants,
  onFileChange,
  onParticipantsChange,
}: ParticipantsUploadProps) {
  const handleFileChange = (newFile: File | null) => {
    onFileChange(newFile);

    // When the CSV is removed, clear its participant preview.
    if (!newFile) {
      onParticipantsChange([]);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Section heading */}
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
          03
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Participants
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Upload the CSV containing the participants who should receive
            certificates.
          </p>
        </div>
      </div>

      {/* CSV format information */}
      <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-800">
          Required CSV columns
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
            name
          </span>

          <span className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
            email
          </span>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Example:{" "}
          <code className="rounded bg-white px-1 py-0.5 text-slate-700">
            name,email
          </code>
        </p>
      </div>

      {/* CSV uploader */}
      <CsvUploader
        file={file}
        onFileChange={handleFileChange}
      />

      {/* Participant preview */}
      <div className="mt-5">
        <ParticipantPreview participants={participants} />
      </div>
    </section>
  );
}