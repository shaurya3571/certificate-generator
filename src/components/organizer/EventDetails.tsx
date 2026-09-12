"use client";

import type { Event } from "@/types/database";

interface EventDetailsProps {
  event: Event;
  onBack: () => void;
}

export function EventDetails({
  event,
  onBack,
}: EventDetailsProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-semibold text-gray-600 transition hover:text-gray-900"
      >
        ← Back to Events
      </button>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Event Details
        </p>

        <h2 className="mt-2 text-2xl font-bold text-gray-900">
          {event.name}
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">
              Template
            </p>

            <p className="mt-1 font-semibold capitalize text-gray-900">
              {event.template}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">
              Created
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {new Date(
                event.created_at,
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">
            Event ID
          </p>

          <p className="mt-1 break-all font-mono text-sm text-gray-900">
            {event.id}
          </p>
        </div>
      </div>
    </div>
  );
}