import { supabase } from "@/lib/supabase/client";

import type { TemplateType } from "@/types/certificate";
import type { Event } from "@/types/database";

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
    throw new Error(error.message);
  }

  return data as Event;
}