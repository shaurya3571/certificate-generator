"use client";

import type { TemplateType } from "@/types/certificate";

interface FormReadinessProps {
  eventName: string;
  selectedTemplate: TemplateType | null;
  customTemplate: File | null;
  participantsFile: File | null;
  participantCount: number;
}

interface RequirementProps {
  complete: boolean;
  label: string;
}

function Requirement({
  complete,
  label,
}: RequirementProps) {
  return (
    <li className="flex items-center gap-2.5">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          complete
            ? "bg-slate-900 text-white"
            : "border border-slate-300 bg-white text-slate-400"
        }`}
        aria-hidden="true"
      >
        {complete ? "✓" : ""}
      </span>

      <span
        className={
          complete
            ? "text-sm text-slate-700"
            : "text-sm text-slate-500"
        }
      >
        {label}
      </span>
    </li>
  );
}

export default function FormReadiness({
  eventName,
  selectedTemplate,
  customTemplate,
  participantsFile,
  participantCount,
}: FormReadinessProps) {
  const hasEventName = eventName.trim().length > 0;
  const hasTemplate = selectedTemplate !== null;

  const hasValidCustomTemplate =
    selectedTemplate !== "custom" || customTemplate !== null;

  const hasCsv = participantsFile !== null;
  const hasParticipants = participantCount > 0;

  const isReady =
    hasEventName &&
    hasTemplate &&
    hasValidCustomTemplate &&
    hasCsv &&
    hasParticipants;

  return (
    <div
      className={`rounded-xl border p-5 ${
        isReady
          ? "border-slate-300 bg-slate-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Generation checklist
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Complete all required steps before generating certificates.
        </p>
      </div>

      <ul className="space-y-3">
        <Requirement
          complete={hasEventName}
          label="Event name added"
        />

        <Requirement
          complete={hasTemplate && hasValidCustomTemplate}
          label={
            selectedTemplate === "custom"
              ? "Custom template selected"
              : "Certificate template selected"
          }
        />

        <Requirement
          complete={hasCsv}
          label="Participant CSV uploaded"
        />

        <Requirement
          complete={hasParticipants}
          label={
            hasParticipants
              ? `${participantCount} participants ready`
              : "Participants validated"
          }
        />
      </ul>

      {!isReady && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <p className="text-xs leading-5 text-slate-500">
            Participant validation will become available after the CSV
            is parsed.
          </p>
        </div>
      )}

      {isReady && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <p className="text-sm font-medium text-slate-700">
            ✓ Everything is ready for certificate generation.
          </p>
        </div>
      )}
    </div>
  );
}