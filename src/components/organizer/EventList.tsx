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
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-950">
            Your Events
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select an event to manage its participants and certificates.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="font-semibold text-slate-900">
            No events yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Create your first event above to start generating certificates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-950">
            Your Events
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select an event to manage its participants and certificates.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {events.map((event) => (
          <button
            type="button"
            key={event.id}
            onClick={() => onSelectEvent(event)}
            className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-900" />

                  <h3 className="truncate font-semibold text-slate-950">
                    {event.name}
                  </h3>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium capitalize">
                    {event.template}
                  </span>

                  <span>
                    Created{" "}
                    {new Date(
                      event.created_at,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="text-sm font-semibold text-slate-600 transition group-hover:text-slate-950">
                  Manage Event
                </span>

                <span
                  aria-hidden="true"
                  className="text-lg text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700"
                >
                  →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
