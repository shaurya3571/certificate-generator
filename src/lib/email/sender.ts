import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error(
    "RESEND_API_KEY is not configured.",
  );
}

const resend = new Resend(apiKey);

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(
  input: SendEmailInput,
) {
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