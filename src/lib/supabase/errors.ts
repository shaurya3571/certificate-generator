interface SupabaseLikeError {
  code?: string;
  message?: string;
}

function isSupabaseLikeError(
  error: unknown,
): error is SupabaseLikeError {
  return (
    typeof error === "object" &&
    error !== null &&
    ("code" in error || "message" in error)
  );
}

export function getSupabaseErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!isSupabaseLikeError(error)) {
    return fallback;
  }

  switch (error.code) {
    case "23505":
      return "This record already exists.";

    case "23503":
      return "This record is linked to another record and cannot be changed.";

    case "23514":
      return "The submitted data is not valid.";

    case "42501":
      return "You do not have permission to perform this action.";

    case "PGRST116":
      return "The requested record was not found.";

    case "PGRST301":
      return "Your session has expired. Please sign in again.";

    default:
      return fallback;
  }
}