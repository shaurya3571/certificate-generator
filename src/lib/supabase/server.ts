import { createServerClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  };
}

export function createSupabaseServerClient(
  accessToken: string,
) {
  const { url, anonKey } = getSupabaseConfig();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // API routes authenticate using the Authorization header.
      },
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export async function getAuthenticatedUser(
  request: Request,
) {
  const authorization =
    request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return {
      user: null,
      accessToken: null,
    };
  }

  const accessToken =
    authorization.slice("Bearer ".length).trim();

  if (!accessToken) {
    return {
      user: null,
      accessToken: null,
    };
  }

  const supabase = createSupabaseServerClient(accessToken);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return {
      user: null,
      accessToken: null,
    };
  }

  return {
    user,
    accessToken,
  };
}
