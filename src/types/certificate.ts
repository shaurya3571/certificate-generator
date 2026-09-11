export type TemplateType = "classic" | "modern" | "custom";

export interface Template {
  id: TemplateType;
  name: string;
  description: string;
}

export interface Participant {
  name: string;
  email: string;
}

export interface CertificateFormState {
  eventName: string;
  template: TemplateType | null;
  customTemplate: File | null;
  participantsFile: File | null;
  participants: Participant[];
}