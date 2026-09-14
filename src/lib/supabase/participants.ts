import { supabase } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Participant } from "@/types/certificate";
import type { DatabaseParticipant } from "@/types/database";
import {
  getSupabaseErrorMessage,
} from "@/lib/supabase/errors";

type SupabaseDatabaseClient = SupabaseClient;

export interface SaveParticipantsInput {
  eventId: string;
  participants: Participant[];
}

export async function saveParticipants(
  input: SaveParticipantsInput,
  client: SupabaseDatabaseClient = supabase,
): Promise<DatabaseParticipant[]> {
  if (input.participants.length === 0) {
    throw new Error("No participants to save.");
  }

  const rows = input.participants.map((participant) => ({
    event_id: input.eventId,
    name: participant.name.trim(),
    email: participant.email.trim(),
  }));

  const { data, error } = await client
    .from("participants")
    .insert(rows)
    .select();

  if (error) {
  throw new Error(
    getSupabaseErrorMessage(
      error,
      "Unable to save participants.",
    ),
  );
}

  return data as DatabaseParticipant[];
}

export async function getEventParticipants(
  eventId: string,
  client: SupabaseDatabaseClient = supabase,
): Promise<DatabaseParticipant[]> {
  if (!eventId.trim()) {
    throw new Error("Event ID is required.");
  }

  const { data, error } = await client
    .from("participants")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(
        error,
        "Unable to fetch participants.",
      ),
    );
  }

  return (data ?? []) as DatabaseParticipant[];
}