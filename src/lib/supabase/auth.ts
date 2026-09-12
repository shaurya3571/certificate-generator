import { supabase } from "@/lib/supabase/client";

export interface SignUpInput {
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export async function signUp(
  input: SignUpInput,
) {
  const { data, error } =
    await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signIn(
  input: SignInInput,
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: input.email.trim(),
      password: input.password,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOut() {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return user;
}