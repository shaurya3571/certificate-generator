"use client";

import {
  useState,
} from "react";
import type { ChangeEvent } from "react";
import { deleteEvent } from "@/lib/supabase/events";
import {
  getEventParticipants,
  saveParticipants,
} from "@/lib/supabase/participants";
import { generateCertificatesForEvent } from "@/lib/certificate/generation-workflow";
import { createCertificatesZip } from "@/lib/certificate/zip";
import type { Participant } from "@/types/certificate";
import type { Event } from "@/types/database";

interface EventDetailsProps {
  event: Event;
  onBack: () => void;
  onDeleted: (eventId: string) => void;
}

export function EventDetails({
  event,
  onBack,
  onDeleted,
}: EventDetailsProps) {
  const [participants, setParticipants] =
    useState<Participant[]>([]);

  const [savingParticipants, setSavingParticipants] =
    useState(false);

  const [loadingParticipants, setLoadingParticipants] =
    useState(false);

  const [participantMessage, setParticipantMessage] =
    useState<string | null>(null);

  const [participantError, setParticipantError] =
    useState<string | null>(null);

  const [generatingCertificates, setGeneratingCertificates] =
    useState(false);

  const [generationMessage, setGenerationMessage] =
    useState<string | null>(null);

  const [generationError, setGenerationError] =
    useState<string | null>(null);

  const [deletingEvent, setDeletingEvent] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState<string | null>(null);

  const handleParticipantsFile = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setParticipantMessage(null);
    setParticipantError(null);
    setLoadingParticipants(true);

    try {
      const text = await file.text();

      const Papa = await import("papaparse");

      const result = Papa.default.parse<Participant>(
        text,
        {
          header: true,
          skipEmptyLines: true,
        },
      );

      const parsedParticipants = result.data
        .map((participant) => ({
          name: participant.name?.trim() ?? "",
          email: participant.email?.trim() ?? "",
        }))
        .filter(
          (participant) =>
            participant.name && participant.email,
        );

      if (parsedParticipants.length === 0) {
        throw new Error(
          "No valid participants found in the CSV.",
        );
      }

      setParticipants(parsedParticipants);
    } catch (error) {
      setParticipants([]);

      setParticipantError(
        error instanceof Error
          ? error.message
          : "Unable to read participants CSV.",
      );
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleSaveParticipants = async () => {
    if (participants.length === 0) {
      setParticipantError(
        "Upload a participants CSV first.",
      );
      return;
    }

    setSavingParticipants(true);
    setParticipantMessage(null);
    setParticipantError(null);

    try {
      await saveParticipants({
        eventId: event.id,
        participants,
      });

      setParticipantMessage(
        `${participants.length} participants saved successfully.`,
      );
    } catch (error) {
      setParticipantError(
        error instanceof Error
          ? error.message
          : "Unable to save participants.",
      );
    } finally {
      setSavingParticipants(false);
    }
  };

  const handleGenerateCertificates = async () => {
    if (generatingCertificates) {
      return;
    }

    setGeneratingCertificates(true);
    setGenerationMessage(null);
    setGenerationError(null);

    try {
      const eventParticipants =
        await getEventParticipants(event.id);

      if (eventParticipants.length === 0) {
        throw new Error(
          "No participants found for this event.",
        );
      }

      const certificates =
        await generateCertificatesForEvent({
          eventId: event.id,
          eventName: event.name,
          template: event.template,
          participants: eventParticipants,
        });

      const zipData =
        await createCertificatesZip(certificates);

      const blob = new Blob(
        [new Uint8Array(zipData)],
        {
          type: "application/zip",
        },
      );

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${event.name
        .trim()
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .replace(/\s+/g, "-")}-certificates.zip`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setGenerationMessage(
        `${certificates.length} certificates generated successfully.`,
      );
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : "Unable to generate certificates.",
      );
    } finally {
      setGeneratingCertificates(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (deletingEvent) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${event.name}"? This will also delete its participants and certificates.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingEvent(true);
    setDeleteError(null);

    try {
      await deleteEvent(event.id);

      onDeleted(event.id);
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete event.",
      );
    } finally {
      setDeletingEvent(false);
    }
  };

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

        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            Selected Event
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-900">
            This event is currently selected.
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Participants and certificates will be
            managed for this event.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Participants
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Upload a CSV containing name and email.
          </p>

          <div className="mt-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleParticipantsFile}
              disabled={loadingParticipants}
              className="block w-full text-sm text-gray-600"
            />
          </div>

          {participants.length > 0 && (
            <div className="mt-4 rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900">
                {participants.length} participants ready
              </p>

              <div className="mt-3 space-y-2">
                {participants.slice(0, 5).map(
                  (participant, index) => (
                    <div
                      key={`${participant.email}-${index}`}
                      className="text-sm text-gray-700"
                    >
                      {participant.name} — {" "}
                      {participant.email}
                    </div>
                  ),
                )}
              </div>

              {participants.length > 5 && (
                <p className="mt-2 text-xs text-gray-500">
                  Showing first 5 participants.
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleSaveParticipants}
            disabled={savingParticipants}
            className="mt-4 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {savingParticipants
              ? "Saving participants..."
              : "Save Participants"}
          </button>

          {participantMessage && (
            <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3">
              <p className="text-sm font-medium text-green-700">
                {participantMessage}
              </p>
            </div>
          )}

          {participantError && (
            <div
              role="alert"
              className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3"
            >
              <p className="text-sm font-medium text-red-700">
                {participantError}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Certificates
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Generate certificates for all saved participants.
          </p>

          <button
            type="button"
            onClick={handleGenerateCertificates}
            disabled={
              generatingCertificates ||
              participants.length === 0
            }
            className="mt-4 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {generatingCertificates
              ? "Generating certificates..."
              : "Generate Certificates"}
          </button>

          {generationMessage && (
            <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3">
              <p className="text-sm font-medium text-green-700">
                {generationMessage}
              </p>
            </div>
          )}

          {generationError && (
            <div
              role="alert"
              className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3"
            >
              <p className="text-sm font-medium text-red-700">
                {generationError}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={handleDeleteEvent}
            disabled={deletingEvent}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deletingEvent
              ? "Deleting event..."
              : "Delete Event"}
          </button>

          {deleteError && (
            <div
              role="alert"
              className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3"
            >
              <p className="text-sm font-medium text-red-700">
                {deleteError}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}