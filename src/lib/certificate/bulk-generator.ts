import type {
  Participant,
  TemplateType,
} from "@/types/certificate";

import { generateCertificate } from "./generator";
import { generateCertificateId } from "./id";

export interface GeneratedCertificate {
  certificateId: string;
  participant: Participant;
  fileName: string;
  data: Uint8Array;
}

export interface BulkGenerationInput {
  eventName: string;
  template: TemplateType;
  participants: Participant[];
}

export async function generateBulkCertificates(
  input: BulkGenerationInput,
): Promise<GeneratedCertificate[]> {
  const generatedCertificates: GeneratedCertificate[] = [];

  const usedCertificateIds = new Set<string>();

  for (const participant of input.participants) {
    let certificateId = generateCertificateId();

    /*
     * Make sure IDs generated during this batch
     * are not duplicated.
     */
    while (usedCertificateIds.has(certificateId)) {
      certificateId = generateCertificateId();
    }

    usedCertificateIds.add(certificateId);

    const data = await generateCertificate({
      eventName: input.eventName,
      participantName: participant.name,
      certificateId,
      template: input.template,
    });

    generatedCertificates.push({
      certificateId,
      participant,
      fileName: `${sanitizeFileName(
        participant.name,
      )}-${certificateId}.pdf`,
      data,
    });
  }

  return generatedCertificates;
}

function sanitizeFileName(value: string): string {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .replace(/\s+/g, "-");
}