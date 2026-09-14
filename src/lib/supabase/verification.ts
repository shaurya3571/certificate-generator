import { supabase } from "@/lib/supabase/client";
import {
  getSupabaseErrorMessage,
} from "@/lib/supabase/errors";

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
    throw new Error(
      getSupabaseErrorMessage(
        error,
        "Unable to verify the certificate.",
      ),
    );
  }

  return data?.[0] ?? null;
}