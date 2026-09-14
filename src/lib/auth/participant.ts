import type { User } from "@supabase/supabase-js";

export function getParticipantEmail(
  user: User | null,
): string | null {
  if (!user?.email) {
    return null;
  }

  return user.email.trim().toLowerCase();
}