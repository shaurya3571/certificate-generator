"use client";

import {
  FormEvent,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signIn } from "@/lib/supabase/auth";
import {
  validateCredentials,
} from "@/lib/auth/validation";
import PageContainer from "@/components/layout/PageContainer";

export default function ParticipantLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError(null);

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
      await signIn({
        email,
        password,
      });

      router.push(
        "/participant/dashboard",
      );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to log in.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="flex min-h-[calc(100vh-170px)] items-center justify-center">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Participant portal
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  View your certificates
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Log in to access certificates
                  associated with your email.
                </p>
              </div>

              <Link
                href="/"
                className="shrink-0 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Home
              </Link>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="participant-email"
                  className="text-sm font-semibold text-slate-700"
                >
                  Email
                </label>

                <input
                  id="participant-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="participant-password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <input
                  id="participant-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  placeholder="Your password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Logging in..."
                  : "Log In"}
              </button>
            </form>

            <div className="mt-6">
              <Link
                href="/login"
                className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Organizer login
              </Link>
            </div>

            <div className="mt-6 text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/participant/signup"
                className="font-semibold text-slate-950 underline-offset-4 transition hover:underline focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}