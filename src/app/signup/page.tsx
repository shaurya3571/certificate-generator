"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { signUp } from "@/lib/supabase/auth";
import {
  validateCredentials,
} from "@/lib/auth/validation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError(null);
    setSuccess(false);

    const validationError =
      validateCredentials(
        email,
        password,
      );

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const data = await signUp({
        email,
        password,
      });

      if (data.user) {
        setSuccess(true);
      } else {
        setError(
          "Unable to create your account.",
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Create Organizer Account
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Create an account to manage your
              certificate events.
            </p>
          </div>

          {success && (
            <div
              role="status"
              className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4"
            >
              <p className="text-sm font-semibold text-green-800">
                Account created successfully.
              </p>

              <p className="mt-1 text-sm text-green-700">
                Please check your email to
                confirm your account.
              </p>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="At least 6 characters"
                autoComplete="new-password"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-500 disabled:bg-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-gray-900 underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}