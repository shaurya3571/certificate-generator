
"use client";
import {
  useEffect,
  useState,
} from "react";
import {
  createEvent,
  getOrganizerEvents,
} from "@/lib/supabase/events";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { EventDetails } from "@/components/organizer/EventDetails";
import { EventList } from "@/components/organizer/EventList";
import type { Event } from "@/types/database";
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

  const [events, setEvents] =
    useState<Event[]>([]);

  const [selectedEvent, setSelectedEvent] =
    useState<Event | null>(null);

  const [eventsLoading, setEventsLoading] =
    useState(true);

  const [eventsError, setEventsError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    const loadEvents = async () => {
      setEventsLoading(true);
      setEventsError(null);

      try {
        const organizerEvents =
          await getOrganizerEvents(user.id);

        setEvents(organizerEvents);
      } catch (error) {
        setEventsError(
          error instanceof Error
            ? error.message
            : "Unable to load events.",
        );
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, [user]);

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
      const createdEvent = await createEvent({
        name: eventName,
        template,
        organizerId: user.id,
      });

      setEvents((currentEvents) => [
        createdEvent,
        ...currentEvents,
      ]);
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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div
        role="status"
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600"
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
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Organizer workspace
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Organizer Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your events and certificates from one place.
            </p>
          </div>

          <LogoutButton />
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Events
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {events.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Created by you
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Selected Event
            </p>

            <p className="mt-2 break-words text-lg font-bold text-slate-950">
              {selectedEvent?.name ?? "None"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Currently selected
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Workspace
            </p>

            <p className="mt-2 text-lg font-bold text-slate-950">
              Ready
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Manage your certificate workflow
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              New event
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-950">
              Create an event
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Set the event name and certificate template.
            </p>
          </div>

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="eventName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="template"
                  className="mb-2 block text-sm font-semibold text-slate-700"
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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
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
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {eventError}
                </p>
              )}

              {eventCreated && (
                <p
                  role="status"
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  Event created successfully.
                </p>
              )}

              <button
                type="button"
                onClick={handleCreateEvent}
                disabled={creatingEvent}
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creatingEvent
                  ? "Creating event..."
                  : "Create Event"}
              </button>
            </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Workspace
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                Your Events
              </h2>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {events.length} {events.length === 1 ? "event" : "events"}
            </span>
          </div>

          <div>
            {eventsLoading && (
              <div
                role="status"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600"
              >
                Loading events...
              </div>
            )}

            {eventsError && (
              <p
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {eventsError}
              </p>
            )}

            {!eventsLoading && !eventsError && (
              <>
                {selectedEvent ? (
                  <EventDetails
                    event={selectedEvent}
                    onBack={() =>
                      setSelectedEvent(null)
                    }
                    onDeleted={(eventId) => {
                      setEvents((currentEvents) =>
                        currentEvents.filter(
                          (event) => event.id !== eventId,
                        ),
                      );
                      setSelectedEvent(null);
                    }}
                  />
                ) : (
                  <EventList
                    events={events}
                    onSelectEvent={setSelectedEvent}
                  />
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
