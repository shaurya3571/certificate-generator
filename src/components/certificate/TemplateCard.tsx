"use client";

interface TemplateCardProps {
  name: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  preview: "classic" | "modern";
}

export default function TemplateCard({
  name,
  description,
  selected,
  onSelect,
  preview,
}: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group w-full rounded-xl border-2 bg-white p-3 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${
  selected
    ? "border-slate-900 shadow-sm"
    : "border-slate-200 hover:border-slate-400"
}`}
    >
      {/* Certificate Preview */}
      <div
        className={`relative aspect-[1.414/1] overflow-hidden rounded-lg border ${
          preview === "classic"
            ? "border-slate-200 bg-stone-50"
            : "border-slate-200 bg-slate-100"
        }`}
      >
        {preview === "classic" ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 h-px w-16 bg-slate-400" />

            <p className="text-[8px] font-semibold tracking-[0.25em] text-slate-500 sm:text-[10px]">
              CERTIFICATE
            </p>

            <p className="mt-2 font-serif text-sm font-bold text-slate-800 sm:text-base">
              OF PARTICIPATION
            </p>

            <div className="mt-4 h-1 w-20 rounded-full bg-slate-300" />

            <p className="mt-2 text-[7px] text-slate-400 sm:text-[9px]">
              Participant Name
            </p>

            <div className="mt-4 h-px w-12 bg-slate-300" />
          </div>
        ) : (
          <div className="flex h-full flex-col justify-between p-4 sm:p-6">
            {/* Modern preview — no unnecessary circle */}
            <div>
              <div className="h-2 w-16 rounded-full bg-slate-700" />

              <p className="mt-8 text-[8px] font-semibold tracking-widest text-slate-500 sm:text-[10px]">
                CERTIFICATE
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900 sm:text-lg">
                Achievement
              </p>

              <div className="mt-3 h-1 w-24 rounded-full bg-slate-300" />

              <p className="mt-2 text-[7px] text-slate-400 sm:text-[9px]">
                Participant Name
              </p>
            </div>

            <div className="flex justify-between">
              <div className="h-px w-12 bg-slate-300" />
              <div className="h-px w-12 bg-slate-300" />
            </div>
          </div>
        )}

        {/* Selected indicator */}
        {selected && (
          <div
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-sm"
            aria-hidden="true"
          >
            ✓
          </div>
        )}
      </div>

      {/* Template information */}
      <div className="mt-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold text-slate-900">{name}</h4>

          {selected && (
            <span className="text-xs font-medium text-slate-700">
              Selected
            </span>
          )}
        </div>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </button>
  );
}