import type { Participant, TemplateType } from "@/types/certificate";
import { generateCertificate } from "@/lib/certificate/generator";
import { generateCertificateId } from "@/lib/certificate/id";
import { sendCertificateEmail } from "./sender";

export interface BulkEmailParticipant {
  participant: Participant;
  certificateId?: string;
}

export interface BulkEmailInput {
  eventName: string;
  template: TemplateType;
  participants: BulkEmailParticipant[];
}

export interface EmailSendResult {
  participant: Participant;
  certificateId?: string;
  success: boolean;
  error?: string;
}

export async function sendBulkCertificateEmails(
  input: BulkEmailInput,
): Promise<EmailSendResult[]> {
  const results: EmailSendResult[] = [];
  const usedCertificateIds = new Set<string>();

  for (const item of input.participants) {
    const { participant } = item;

    try {
      let certificateId =
        item.certificateId ?? generateCertificateId();

      if (!item.certificateId) {
        while (usedCertificateIds.has(certificateId)) {
          certificateId = generateCertificateId();
        }

        usedCertificateIds.add(certificateId);
      }

      const certificatePdf = await generateCertificate({
        eventName: input.eventName,
        participantName: participant.name,
        certificateId,
        template: input.template,
      });

      const safeName = participant.name
        .trim()
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .replace(/\s+/g, "-");

      const fileName = `${safeName}-${certificateId}.pdf`;

      await sendCertificateEmail({
        to: participant.email,
        participantName: participant.name,
        eventName: input.eventName,
        certificateId,
        certificatePdf,
        fileName,
      });

      results.push({
        participant,
        certificateId,
        success: true,
      });
    } catch (error) {
      results.push({
        participant,
        certificateId: item.certificateId,
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to send certificate email.",
      });
    }
  }

  return results;
}