import type { Participant } from "@/types/certificate";

interface ParticipantPreviewProps {
  participants: Participant[];
}

export function ParticipantPreview({
  participants,
}: ParticipantPreviewProps) {
  if (participants.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-sm font-medium text-gray-700">
          No valid participants found
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Upload a valid CSV file to preview participants.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Participant Preview
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Review the participants that will receive certificates.
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          {participants.length}{" "}
          {participants.length === 1
            ? "participant"
            : "participants"}
        </span>
      </div>

      <div className="max-h-80 overflow-y-auto overflow-x-auto">
        <table className="w-full min-w-[500px] text-left">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                #
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Name
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {participants.map((participant, index) => (
              <tr
                key={`${participant.email}-${index}`}
                className="transition hover:bg-gray-50"
              >
                <td className="px-5 py-3 text-sm text-gray-400">
                  {index + 1}
                </td>

                <td className="px-5 py-3 text-sm font-medium text-gray-900">
                  {participant.name}
                </td>

                <td className="px-5 py-3 text-sm text-gray-600">
                  {participant.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">
        <p className="text-xs text-gray-500">
          These participants will receive certificates when generation
          is started.
        </p>
      </div>
    </div>
  );
}

// Keep default export compatibility with existing imports.
export default ParticipantPreview;
