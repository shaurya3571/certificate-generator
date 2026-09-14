import type { Participant, TemplateType } from "@/types/certificate";
import { generateCertificate } from "@/lib/certificate/generator";
import { generateCertificateId } from "@/lib/certificate/id";
import { sendCertificateEmail, sendEmail } from "./sender";
import type {
  BulkEmailInput,
  BulkEmailSendResult,
} from "./types";

export interface BulkEmailParticipant {
  participant: Participant;
  certificateId?: string;
}

export interface BulkCertificateEmailInput {
  eventName: string;
  template: TemplateType;
  participants: BulkEmailParticipant[];
  subject?: string;
  message?: string;
}

export interface EmailSendResult {
  participant: Participant;
  certificateId?: string;
  success: boolean;
  error?: string;
}

export async function sendBulkCertificateEmails(
  input: BulkCertificateEmailInput,
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
        subject: input.subject,
        message: input.message,
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

// ---------------------------------------------------------------------------
// Generic bulk email (CSV recipients + custom subject/message)
// ---------------------------------------------------------------------------

/**
 * Personalises a message template for a single recipient.
 * Replaces {{name}} with the recipient's name, or "there" as a fallback.
 */
function personaliseMessage(
  message: string,
  name: string | undefined,
): string {
  return message.replace(
    /\{\{name\}\}/g,
    name?.trim() || "there",
  );
}

/**
 * Send a custom email to every recipient in the list.
 *
 * Each email is sent individually — recipients are never
 * exposed to each other via CC or BCC.
 *
 * Returns a result per recipient indicating success or failure.
 */
export async function sendGenericBulkEmails(
  input: BulkEmailInput,
): Promise<BulkEmailSendResult[]> {
  const results: BulkEmailSendResult[] = [];

  for (const recipient of input.recipients) {
    try {
      const personalisedMessage = personaliseMessage(
        input.message,
        recipient.name,
      );

      // Convert newlines to <br> for basic HTML rendering.
      const htmlBody = personalisedMessage
        .split("\n")
        .map((line) =>
          line.trim() === ""
            ? "<br />"
            : `<p style="margin:0 0 8px 0">${line}</p>`,
        )
        .join("\n");

      await sendEmail({
        to: recipient.email,
        subject: input.subject,
        html: htmlBody,
      });

      results.push({
        email: recipient.email,
        success: true,
      });
    } catch (error) {
      results.push({
        email: recipient.email,
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to send email.",
      });
    }
  }

  return results;
}