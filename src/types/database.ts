export interface Event {
  id: string;
  name: string;
  template: "classic" | "modern" | "custom";
  created_at: string;
}
export interface DatabaseParticipant {
  id: string;
  event_id: string;
  name: string;
  email: string;
  created_at: string;
}
export type EmailStatus =
  | "pending"
  | "sent"
  | "failed";

export interface DatabaseCertificate {
  id: string;
  event_id: string;
  participant_id: string;
  certificate_id: string;
  file_name: string;
  email_status: EmailStatus;
  email_error: string | null;
  created_at: string;
}