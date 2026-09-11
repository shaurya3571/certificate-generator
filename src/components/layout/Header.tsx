export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Certificate Generator
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Create certificates in bulk
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">Organizer</p>
            <p className="text-xs text-slate-500">Certificate workspace</p>
          </div>

          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700"
            aria-label="Organizer profile"
          >
            O
          </div>
        </div>
      </div>
    </header>
  );
}