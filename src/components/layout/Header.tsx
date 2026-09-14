import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <Link
            href="/"
            className="block truncate text-lg font-bold tracking-tight text-slate-950 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Certificate Generator
          </Link>

          <p className="hidden text-xs text-slate-500 sm:block">
            Create certificates in bulk
          </p>
        </div>

        <div className="ml-4 flex shrink-0 items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">
              Organizer
            </p>

            <p className="text-xs text-slate-500">
              Certificate workspace
            </p>
          </div>

          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700"
            aria-label="Organizer profile"
          >
            O
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Log In
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}