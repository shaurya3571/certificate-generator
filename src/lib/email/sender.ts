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
    throw new Error(error.message);
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

  const { data, error } = await resend.emails.send({
    from,

    to: [input.to],

    subject: `Your certificate for ${input.eventName}`,

    html: `
      <div>
        <h2>Certificate of Participation</h2>

        <p>Hi ${input.participantName},</p>

        <p>
          Thank you for participating in
          <strong>${input.eventName}</strong>.
        </p>

        <p>
          Your certificate is attached to this email.
        </p>

        <p>
          <strong>Certificate ID:</strong>
          ${input.certificateId}
        </p>

        <p>
          Regards,<br />
          Certificate Generator
        </p>
      </div>
    `,

    attachments: [
      {
        filename: input.fileName,
        content: Buffer.from(input.certificatePdf),      
    },
    ],
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}