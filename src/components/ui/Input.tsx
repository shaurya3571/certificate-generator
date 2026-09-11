import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-900"
      >
        {label}
      </label>

      <input
        id={inputId}
        {...props}
        className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
        }`}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error
            ? `${inputId}-error`
            : helperText
              ? `${inputId}-helper`
              : undefined
        }
      />

      {error ? (
        <p
          id={`${inputId}-error`}
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="text-sm text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}