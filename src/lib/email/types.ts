/**
 * Generic bulk-email types.
 *
 * These are used by:
 *  - src/lib/email/bulk-sender.ts  (sendGenericBulkEmails)
 *  - src/app/api/email/send-bulk/route.ts
 *  - src/components/organizer/BulkEmailCard.tsx (via the API response shape)
 */

export interface BulkEmailRecipient {
  /** Optional display name. Used for {{name}} personalisation. */
  name?: string;
  email: string;
}

export interface BulkEmailInput {
  recipients: BulkEmailRecipient[];
  /** Email subject line. */
  subject: string;
  /**
   * Plain-text (or minimal HTML) message body.
   * Supports {{name}} placeholder — replaced per recipient.
   * Falls back to "there" when the recipient has no name.
   */
  message: string;
}

export interface BulkEmailSendResult {
  email: string;
  success: boolean;
  error?: string;
}

export interface BulkEmailSummary {
  sent: number;
  failed: number;
}
