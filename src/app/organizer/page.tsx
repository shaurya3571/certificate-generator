
"use client";
import { useEffect, useState } from "react";
import { createEvent } from "@/lib/supabase/events";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default function OrganizerPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [eventName, setEventName] =
    useState("");

  const [template, setTemplate] =
    useState<"classic" | "modern">("classic");

  const [creatingEvent, setCreatingEvent] =
    useState(false);

  const [eventError, setEventError] =
    useState<string | null>(null);

  const [eventCreated, setEventCreated] =
    useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const handleCreateEvent = async () => {
    if (!user) {
      return;
    }

    if (!eventName.trim()) {
      setEventError(
        "Event name is required.",
      );
      return;
    }

    setCreatingEvent(true);
    setEventError(null);
    setEventCreated(false);

    try {
      await createEvent({
        name: eventName,
        template,
        organizerId: user.id,
      });

      setEventName("");
      setTemplate("classic");
      setEventCreated(true);
    } catch (err) {
      setEventError(
        err instanceof Error
          ? err.message
          : "Unable to create event.",
      );
    } finally {
      setCreatingEvent(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div
          role="status"
          className="text-sm text-gray-600"
        >
          Checking your session...
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Organizer Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              {user.email}
            </p>
          </div>

          <LogoutButton />
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Events
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Participants
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Certificates
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              0
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Certificate Management
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Your events and certificate activity will
            appear here.
          </p>

          <div className="mt-5 rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-900">
              Create Event
            </h3>

            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="eventName"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Event Name
                </label>

                <input
                  id="eventName"
                  type="text"
                  value={eventName}
                  onChange={(event) =>
                    setEventName(event.target.value)
                  }
                  placeholder="e.g. Tech Fest 2026"
                  disabled={creatingEvent}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="template"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Template
                </label>

                <select
                  id="template"
                  value={template}
                  onChange={(event) =>
                    setTemplate(
                      event.target.value as
                        | "classic"
                        | "modern",
                    )
                  }
                  disabled={creatingEvent}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 disabled:bg-gray-100"
                >
                  <option value="classic">
                    Classic
                  </option>

                  <option value="modern">
                    Modern
                  </option>
                </select>
              </div>

              {eventError && (
                <p
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {eventError}
                </p>
              )}

              {eventCreated && (
                <p
                  role="status"
                  className="text-sm text-green-600"
                >
                  Event created successfully.
                </p>
              )}

              <button
                type="button"
                onClick={handleCreateEvent}
                disabled={creatingEvent}
                className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {creatingEvent
                  ? "Creating event..."
                  : "Create Event"}
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <p className="text-sm font-medium text-gray-700">
              No events yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Event management will be connected in
              the next step.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
