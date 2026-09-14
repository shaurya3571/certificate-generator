import { supabase } from "@/lib/supabase/client";

export interface VerificationCertificate {
  certificate_id: string;
  participant_name: string;
  event_name: string;
  issued_at: string;
}

export async function getCertificateById(
  certificateId: string,
): Promise<VerificationCertificate | null> {
  const normalizedId = certificateId.trim().toUpperCase();

  const { data, error } = await supabase.rpc("verify_certificate", {
    lookup_certificate_id: normalizedId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0] ?? null;
}