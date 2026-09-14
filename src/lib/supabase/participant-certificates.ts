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
      .select("id, event_id")
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
      .select("id, name")
      .in("id", eventIds);

  if (eventsError) {
    throw new Error(eventsError.message);
  }

  const eventNames = new Map(
    (events ?? []).map((event) => [
      event.id,
      event.name,
    ]),
  );

  return certificates.map((certificate) => ({
    ...certificate,
    event_name:
      eventNames.get(certificate.event_id) ??
      "Unknown event",
  }));
}