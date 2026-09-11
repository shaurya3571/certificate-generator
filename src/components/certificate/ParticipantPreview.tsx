"use client";

import type { Participant } from "@/types/certificate";

interface ParticipantPreviewProps {
  participants: Participant[];
}

export default function ParticipantPreview({
  participants,
}: ParticipantPreviewProps) {
  if (participants.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5 text-slate-500"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
              />

              <circle cx="9" cy="7" r="4" />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
              />
            </svg>
          </div>

          <p className="mt-3 text-sm font-medium text-slate-900">
            No participants uploaded yet
          </p>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Upload a CSV file to preview your participants here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Participants
          </h4>

          <p className="mt-0.5 text-xs text-slate-500">
            Preview of participants from your CSV file
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {participants.length}{" "}
          {participants.length === 1
            ? "participant"
            : "participants"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-left">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5">
                #
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5">
                Name
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5">
                Email
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {participants.map((participant, index) => (
              <tr
                key={`${participant.email}-${index}`}
                className="transition hover:bg-slate-50"
              >
                <td className="px-4 py-3.5 text-sm text-slate-400 sm:px-5">
                  {index + 1}
                </td>

                <td className="px-4 py-3.5 text-sm font-medium text-slate-900 sm:px-5">
                  {participant.name}
                </td>

                <td className="px-4 py-3.5 text-sm text-slate-600 sm:px-5">
                  {participant.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <p className="text-xs text-slate-500">
          These participants will receive certificates when generation
          is started.
        </p>
      </div>
    </div>
  );
}