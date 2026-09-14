import type { ParticipantCertificate } from "@/types/database";

export function groupCertificatesByEvent(
  certificates: ParticipantCertificate[],
) {
  return certificates.reduce(
    (groups, certificate) => {
      const existing =
        groups[certificate.event_id] ?? {
          eventId: certificate.event_id,
          eventName: certificate.event_name,
          certificates: [],
        };

      existing.certificates.push(certificate);
      groups[certificate.event_id] = existing;

      return groups;
    },
    {} as Record<
      string,
      {
        eventId: string;
        eventName: string;
        certificates: ParticipantCertificate[];
      }
    >,
  );
}