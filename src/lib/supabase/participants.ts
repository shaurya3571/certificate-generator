import { supabase } from "@/lib/supabase/client";

import type { Participant } from "@/types/certificate";
import type { DatabaseParticipant } from "@/types/database";
import {
  getSupabaseErrorMessage,
} from "@/lib/supabase/errors";

export interface SaveParticipantsInput {
  eventId: string;
  participants: Participant[];
}

export async function saveParticipants(
  input: SaveParticipantsInput,
): Promise<DatabaseParticipant[]> {
  if (input.participants.length === 0) {
    throw new Error("No participants to save.");
  }

  const rows = input.participants.map((participant) => ({
    event_id: input.eventId,
    name: participant.name.trim(),
    email: participant.email.trim(),
  }));

  const { data, error } = await supabase
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