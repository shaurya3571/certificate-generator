const steps = [
  { number: "01", label: "Event" },
  { number: "02", label: "Template" },
  { number: "03", label: "Participants" },
  { number: "04", label: "Generate" },
];

export default function StepIndicator() {
  return (
    <nav
      aria-label="Certificate creation steps"
      className="mb-8"
    >
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li
            key={step.number}
            className="flex flex-1 items-center"
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  index === 0
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 bg-white text-slate-500"
                }`}
              >
                {step.number}
              </span>

              <span
                className={`hidden text-sm font-medium sm:block ${
                  index === 0
                    ? "text-slate-900"
                    : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="mx-3 h-px flex-1 bg-slate-200 sm:mx-4" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}