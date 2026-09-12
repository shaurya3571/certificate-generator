import { supabase } from "@/lib/supabase/client";

import type { TemplateType } from "@/types/certificate";
import type { Event } from "@/types/database";
import {
  getSupabaseErrorMessage,
} from "@/lib/supabase/errors";

export interface CreateEventInput {
  name: string;
  template: TemplateType;
}

export async function createEvent(
  input: CreateEventInput,
): Promise<Event> {
  const { data, error } = await supabase
    .from("events")
    .insert({
      name: input.name.trim(),
      template: input.template,
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