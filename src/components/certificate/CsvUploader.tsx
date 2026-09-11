"use client";

import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
} from "react";

interface CsvUploaderProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CsvUploader({
  file,
  onFileChange,
}: CsvUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (selectedFile: File) => {
    const isCsv =
      selectedFile.type === "text/csv" ||
      selectedFile.name.toLowerCase().endsWith(".csv");

    if (!isCsv) {
      setError("Invalid file type. Please upload a CSV file.");
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(
        "File is too large. Please upload a CSV smaller than 5 MB.",
      );
      return false;
    }

    if (selectedFile.size === 0) {
      setError("This CSV file is empty. Please upload a valid file.");
      return false;
    }

    setError("");
    return true;
  };

  const handleFile = (selectedFile: File | undefined) => {
    if (!selectedFile) {
      return;
    }

    if (!validateFile(selectedFile)) {
      return;
    }

    onFileChange(selectedFile);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    handleFile(event.target.files?.[0]);

    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    handleFile(event.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    onFileChange(null);
    setError("");
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload participants CSV"
      />

      {!file ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${
            isDragging
              ? "border-slate-900 bg-slate-100"
              : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-white"
          }`}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6 text-slate-600"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4h16v16H4z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 8h8M8 12h8M8 16h4"
              />
            </svg>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-900">
            Drag & drop your CSV here
          </p>

          <p className="mt-1 text-sm text-slate-500">
            or{" "}
            <span className="font-medium text-slate-900 underline underline-offset-2">
              browse files
            </span>
          </p>

          <p className="mt-3 text-xs text-slate-400">
            CSV files only · Maximum 5 MB
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-700 shadow-sm">
              CSV
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {file.name}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {formatFileSize(file.size)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Remove
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white">
              ✓
            </span>

            Participant file ready
          </div>
        </div>
      )}

      {error && (
        <div
          className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}