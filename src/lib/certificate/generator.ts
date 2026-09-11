export interface CertificateGenerationInput {
  eventName: string;
  participantName: string;
  certificateId: string;
}

export async function generateCertificate(
  input: CertificateGenerationInput,
): Promise<Uint8Array> {
  throw new Error("Certificate generation not implemented yet.");
}