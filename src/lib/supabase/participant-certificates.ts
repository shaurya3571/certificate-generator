import { supabase } from "@/lib/supabase/client";
import type { ParticipantCertificate } from "@/types/database";

export async function getParticipantCertificates(
  email: string,
): Promise<ParticipantCertificate[]> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return [];
  }

  const { data: participants, error: participantsError } =
    await supabase
      .from("participants")
      .select("id, event_id, name")
      .eq("email", normalizedEmail);

  if (participantsError) {
    throw new Error(participantsError.message);
  }

  if (!participants || participants.length === 0) {
    return [];
  }

  const participantIds = participants.map(
    (participant) => participant.id,
  );

  const eventIds = participants.map(
    (participant) => participant.event_id,
  );

  const participantNames = new Map(
    participants.map((participant) => [
      participant.id,
      participant.name,
    ]),
  );

  const { data: certificates, error: certificatesError } =
    await supabase
      .from("certificates")
      .select(
        "id, event_id, participant_id, certificate_id, file_name, email_status, email_error, created_at",
      )
      .in("participant_id", participantIds);

  if (certificatesError) {
    throw new Error(certificatesError.message);
  }

  if (!certificates || certificates.length === 0) {
    return [];
  }

  const { data: events, error: eventsError } =
    await supabase
      .from("events")
      .select("id, name, template")
      .in("id", eventIds);

  if (eventsError) {
    throw new Error(eventsError.message);
  }

  const eventDetails = new Map(
    (events ?? []).map((event) => [
      event.id,
      {
        name: event.name,
        template: event.template,
      },
    ]),
  );

  return certificates.map((certificate) => {
    const event = eventDetails.get(certificate.event_id);

    return {
      ...certificate,
      event_name: event?.name ?? "Unknown event",
      participant_name:
        participantNames.get(certificate.participant_id) ??
        "Unknown participant",
      template: event?.template ?? "classic",
    };
  });
}