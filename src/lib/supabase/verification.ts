import { supabase } from "@/lib/supabase/client";

export interface VerificationCertificate {
  id: string;
  event_id: string;
  participant_id: string;
  certificate_id: string;
  file_name: string;
  created_at: string;
}

export async function getCertificateById(
  certificateId: string,
): Promise<VerificationCertificate | null> {
  const normalizedId = certificateId.trim().toUpperCase();

  const { data, error } = await supabase
    .from("certificates")
    .select(
      "id, event_id, participant_id, certificate_id, file_name, created_at",
    )
    .eq("certificate_id", normalizedId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}