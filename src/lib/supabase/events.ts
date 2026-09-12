import { supabase } from "@/lib/supabase/client";

import {
  getSupabaseErrorMessage,
} from "@/lib/supabase/errors";

import type { TemplateType } from "@/types/certificate";
import type { Event } from "@/types/database";

export interface CreateEventInput {
  name: string;
  template: TemplateType;
  organizerId: string;
}

export async function createEvent(
  input: CreateEventInput,
): Promise<Event> {
  if (!input.organizerId.trim()) {
    throw new Error("Organizer ID is required.");
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      name: input.name.trim(),
      template: input.template,
      organizer_id: input.organizerId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(
        error,
        "Unable to create event.",
      ),
    );
  }

  return data as Event;
}