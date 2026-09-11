"use client";

import Input from "@/components/ui/Input";

interface EventDetailsProps {
  eventName: string;
  onEventNameChange: (value: string) => void;
}

export default function EventDetails({
  eventName,
  onEventNameChange,
}: EventDetailsProps) {
  const trimmedName = eventName.trim();

  const error =
    eventName.length > 0 && trimmedName.length === 0
      ? "Event name cannot contain only spaces."
      : undefined;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
          01
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Event details
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Tell us which event these certificates are for.
          </p>
        </div>
      </div>

      <Input
        id="event-name"
        label="Event Name"
        value={eventName}
        onChange={(event) => onEventNameChange(event.target.value)}
        placeholder="e.g. Web Development Workshop"
        helperText="This name will appear on every generated certificate."
        maxLength={100}
        required
      />

      <div className="mt-2 flex justify-end">
        <span className="text-xs text-slate-400">
          {eventName.length}/100
        </span>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}