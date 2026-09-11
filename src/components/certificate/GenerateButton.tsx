"use client";

interface GenerateButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export default function GenerateButton({
  disabled,
  onClick,
}: GenerateButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:w-auto ${
        disabled
          ? "cursor-not-allowed bg-slate-200 text-slate-400"
          : "bg-slate-900 text-white shadow-sm hover:bg-slate-800 active:bg-slate-950"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v12m0 0 4-4m-4 4-4-4"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 21h14"
        />
      </svg>

      Generate Certificates
    </button>
  );
}