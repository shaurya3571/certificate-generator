"use client";

import { DragEvent, ChangeEvent, useRef, useState } from "react";

interface CustomTemplateUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onTemplateSelect: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
];

const ACCEPTED_EXTENSIONS = ".pdf,.png,.jpg,.jpeg";

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CustomTemplateUpload({
  file,
  onFileChange,
  onTemplateSelect,
}: CustomTemplateUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (selectedFile: File) => {
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError("Unsupported file type. Please upload a PDF, PNG, or JPG file.");
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File is too large. Please upload a file smaller than 10 MB.");
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
    onTemplateSelect();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);

    // Allows selecting the same file again after removing it.
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
    <div className="mt-4">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload certificate template"
      />

      {!file ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              inputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${
            isDragging
              ? "border-slate-900 bg-slate-100"
              : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50"
          }`}
        >
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5 text-slate-600"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16V4m0 0L8 8m4-4 4 4M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
              />
            </svg>
          </div>

          <p className="mt-3 text-sm font-medium text-slate-900">
            Drag & drop your template here
          </p>

          <p className="mt-1 text-sm text-slate-500">
            or{" "}
            <span className="font-medium text-slate-900 underline underline-offset-2">
              browse files
            </span>
          </p>

          <p className="mt-2 text-xs text-slate-400">
            PDF, PNG, JPG or JPEG · Maximum 10 MB
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-700 shadow-sm">
              {file.type === "application/pdf" ? "PDF" : "IMG"}
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
              className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
            >
              Remove
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white">
              ✓
            </span>

            Custom template selected
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