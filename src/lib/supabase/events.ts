import { supabase } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseErrorMessage,
} from "@/lib/supabase/errors";
import type { TemplateType } from "@/types/certificate";
import type { Event } from "@/types/database";

type SupabaseDatabaseClient = SupabaseClient;

export interface CreateEventInput {
  name: string;
  template: TemplateType;
  organizerId: string;
}

export async function createEvent(
  input: CreateEventInput,
  client: SupabaseDatabaseClient = supabase,
): Promise<Event> {
  if (!input.organizerId.trim()) {
    throw new Error("Organizer ID is required.");
  }

  const { data, error } = await client
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

export async function getOrganizerEvents(
  organizerId: string,
  client: SupabaseDatabaseClient = supabase,
): Promise<Event[]> {
  if (!organizerId.trim()) {
    throw new Error("Organizer ID is required.");
  }

  const { data, error } = await client
    .from("events")
    .select("*")
    .eq("organizer_id", organizerId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(
        error,
        "Unable to fetch events.",
      ),
    );
  }

  return (data ?? []) as Event[];
}

export async function deleteEvent(
  eventId: string,
  client: SupabaseDatabaseClient = supabase,
): Promise<void> {
  if (!eventId.trim()) {
    throw new Error("Event ID is required.");
  }

  const { error } = await client
    .from("events")
    .delete()
    .eq("id", eventId);

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(
        error,
        "Unable to delete event.",
      ),
    );
  }
}