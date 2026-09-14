import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured.",
    );
  }

  return new Resend(apiKey);
}

/**
 * Extracts a human-readable message from a Resend API error.
 *
 * Resend errors are structured objects — `error.message` is sometimes
 * an empty string while the real reason sits in `error.name` or the
 * stringified body. This helper pulls the most useful text available.
 */
function getResendErrorMessage(
  error: { message?: string; name?: string },
): string {
  const msg = error?.message?.trim();
  if (msg) return msg;
  const name = error?.name?.trim();
  if (name && name !== "Error") return name;
  return "Email rejected by Resend. Check that the recipient address is verified or that your sending domain is configured.";
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export interface EmailAttachment {
  filename: string;
  content: Uint8Array;
}

export interface SendCertificateEmailInput {
  to: string;
  participantName: string;
  eventName: string;
  certificateId: string;
  certificatePdf: Uint8Array;
  fileName: string;
  subject?: string;
  message?: string;
}

export async function sendEmail(
  input: SendEmailInput,
) {
  const resend = getResendClient();
  const from =
    process.env.RESEND_FROM_EMAIL ??
    "Certificate Generator <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to: [input.to],
    subject: input.subject,
    html: input.html,
  });

  if (error) {
    throw new Error(getResendErrorMessage(error));
  }

  return data;
}

export async function sendCertificateEmail(
  input: SendCertificateEmailInput,
) {
  const resend = getResendClient();
  const from =
    process.env.RESEND_FROM_EMAIL ??
    "Certificate Generator <onboarding@resend.dev>";

  const subject =
    input.subject ||
    `Your certificate for ${input.eventName}`;

  // If a custom message is provided, replace {{name}} and wrap in simple HTML.
  // Otherwise, use the default template.
  const html = input.message
    ? input.message
        .replace(/\{\{name\}\}/g, input.participantName || "there")
        .split("\n")
        .map((line) =>
          line.trim() === ""
            ? "<br />"
            : `<p style="margin:0 0 8px 0">${line}</p>`,
        )
        .join("\n")
    : `
      <div>
        <h2>Certificate of Participation</h2>

        <p>Hi ${input.participantName},</p>

        <p>
          Thank you for participating in
          <strong>${input.eventName}</strong>.
        </p>

        <p>
          Please find your certificate of participation
          attached to this email.
        </p>

        <br />
        <p>Regards,</p>
        <p>Certificate Generator</p>
      </div>
    `;

  const { data, error } = await resend.emails.send({
    from,
    to: [input.to],
    subject,
    html,
    attachments: [
      {
        filename: input.fileName,
        content: Buffer.from(input.certificatePdf),
      },
    ],
  });

  if (error) {
    throw new Error(getResendErrorMessage(error));
  }

  return data;
}