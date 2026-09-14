 import { supabase } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  DatabaseCertificate,
} from "@/types/database";
import {
  getSupabaseErrorMessage,
} from "@/lib/supabase/errors";

type SupabaseDatabaseClient = SupabaseClient;

export interface SaveCertificateInput {
  eventId: string;
  participantId: string;
  certificateId: string;
  fileName: string;
  emailStatus?: "pending" | "sent" | "failed";
  emailError?: string | null;
}

export async function saveCertificate(
  input: SaveCertificateInput,
  client: SupabaseDatabaseClient = supabase,
): Promise<DatabaseCertificate> {
  if (!input.eventId.trim()) {
    throw new Error("Event ID is required.");
  }

  if (!input.participantId.trim()) {
    throw new Error("Participant ID is required.");
  }

  if (!input.certificateId.trim()) {
    throw new Error("Certificate ID is required.");
  }

  if (!input.fileName.trim()) {
    throw new Error("Certificate file name is required.");
  }

  const { data, error } = await client
    .from("certificates")
    .insert({
      event_id: input.eventId,
      participant_id: input.participantId,
      certificate_id: input.certificateId.trim(),
      file_name: input.fileName.trim(),
      email_status:
        input.emailStatus ?? "pending",
      email_error:
        input.emailError ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(
        error,
        "Unable to save certificate.",
      ),
    );
  }

  return data as DatabaseCertificate;
}
export interface SaveCertificateRecord {
  eventId: string;
  participantId: string;
  certificateId: string;
  fileName: string;
  emailStatus?: "pending" | "sent" | "failed";
  emailError?: string | null;
}

export async function saveCertificates(
  records: SaveCertificateRecord[],
  client: SupabaseDatabaseClient = supabase,
): Promise<DatabaseCertificate[]> {
  if (records.length === 0) {
    throw new Error(
      "No certificate records to save.",
    );
  }

  const rows = records.map((record) => ({
    event_id: record.eventId,
    participant_id: record.participantId,
    certificate_id: record.certificateId.trim(),
    file_name: record.fileName.trim(),
    email_status:
      record.emailStatus ?? "pending",
    email_error:
      record.emailError ?? null,
  }));

  const { data, error } = await client
    .from("certificates")
    .insert(rows)
    .select();

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(
        error,
        "Unable to save certificates.",
      ),
    );
  }

  return data as DatabaseCertificate[];
}
export async function updateCertificateEmailStatus(
  certificateId: string,
  status: "pending" | "sent" | "failed",
  errorMessage: string | null = null,
  client: SupabaseDatabaseClient = supabase,
): Promise<DatabaseCertificate> {
  const { data, error } = await client
    .from("certificates")
    .update({
      email_status: status,
      email_error: errorMessage,
    })
    .eq("certificate_id", certificateId)
    .select()
    .single();

  if (error) {
  throw new Error(
    getSupabaseErrorMessage(
      error,
      "Unable to save certificate data.",
    ),
  );
}

  return data as DatabaseCertificate;
}