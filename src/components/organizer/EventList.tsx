"use client";

import type { Event } from "@/types/database";

interface EventListProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
}

export function EventList({
  events,
  onSelectEvent,
}: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Your Events
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          No events created yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Your Events
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {events.length}{" "}
            {events.length === 1
              ? "event"
              : "events"}{" "}
            created
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {events.map((event) => (
          <button
            type="button"
            key={event.id}
            onClick={() => onSelectEvent(event)}
            className="w-full rounded-xl border border-gray-200 p-4 text-left transition hover:bg-gray-50"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {event.name}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Template:{" "}
                  <span className="capitalize">
                    {event.template}
                  </span>
                </p>
              </div>

              <p className="text-xs text-gray-500">
                {new Date(
                  event.created_at,
                ).toLocaleDateString()}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
