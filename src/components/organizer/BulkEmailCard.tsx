"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { supabase } from "@/lib/supabase/client";
import { parseRecipientsCsv } from "@/lib/csv/email-recipients";
import type {
  ParsedRecipient,
  InvalidRow,
} from "@/lib/csv/email-recipients";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CardState =
  | "idle"
  | "parsing"
  | "ready"
  | "sending"
  | "success"
  | "partial"
  | "error";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BulkEmailCard() {
  // ── CSV / recipients ──────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validRecipients, setValidRecipients] = useState<
    ParsedRecipient[]
  >([]);
  const [invalidRows, setInvalidRows] = useState<InvalidRow[]>([]);

  // ── Form fields ───────────────────────────────────────────────────────────
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // ── UI state ──────────────────────────────────────────────────────────────
  const [cardState, setCardState] = useState<CardState>("idle");
  const [parseError, setParseError] = useState<string | null>(null);
  const [sendResult, setSendResult] = useState<{
    sent: number;
    failed: number;
  } | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCardState("parsing");
    setParseError(null);
    setValidRecipients([]);
    setInvalidRows([]);
    setSendResult(null);
    setSendError(null);

    try {
      const text = await file.text();
      const { valid, invalid } = parseRecipientsCsv(text);

      setValidRecipients(valid);
      setInvalidRows(invalid);

      if (valid.length === 0 && invalid.length === 0) {
        setParseError("The CSV file appears to be empty.");
        setCardState("idle");
      } else if (valid.length === 0) {
        setParseError(
          "No valid recipients found. Please check the CSV.",
        );
        setCardState("idle");
      } else {
        setCardState("ready");
      }
    } catch {
      setParseError("Unable to read the CSV file.");
      setCardState("idle");
    }
  };

  const handleReset = () => {
    setCardState("idle");
    setValidRecipients([]);
    setInvalidRows([]);
    setSubject("");
    setMessage("");
    setParseError(null);
    setSendResult(null);
    setSendError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    if (validRecipients.length === 0) return;
    if (!subject.trim() || !message.trim()) return;

    setCardState("sending");
    setSendError(null);
    setSendResult(null);

    try {
      // Get the current session token to authenticate the request.
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setSendError("Your session has expired. Please log in again.");
        setCardState("error");
        return;
      }

      const response = await fetch("/api/email/send-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          recipients: validRecipients,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = (await response.json()) as {
        sent?: number;
        failed?: number;
        error?: string;
      };

      if (!response.ok) {
        setSendError(data.error ?? "Unable to send emails.");
        setCardState("error");
        return;
      }

      const sent = data.sent ?? 0;
      const failed = data.failed ?? 0;

      setSendResult({ sent, failed });
      setCardState(failed === 0 ? "success" : "partial");
    } catch {
      setSendError("Unable to send emails. Please try again.");
      setCardState("error");
    }
  };

  // ── Derived helpers ───────────────────────────────────────────────────────

  const canSend =
    cardState === "ready" &&
    validRecipients.length > 0 &&
    subject.trim().length > 0 &&
    message.trim().length > 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950">
            Bulk Email
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Send an email to multiple recipients using a CSV file.
          </p>
        </div>

        {/* Reset button — visible once a file has been loaded */}
        {cardState !== "idle" && (
          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
          >
            Reset
          </button>
        )}
      </div>

      {/* ── Parsing spinner ── */}
      {cardState === "parsing" && (
        <p
          role="status"
          className="mt-4 text-sm text-slate-500"
        >
          Reading recipients…
        </p>
      )}

      {/* ── CSV file input (idle / ready states) ── */}
      {(cardState === "idle" || cardState === "ready") && (
        <div className="mt-4">
          <label
            htmlFor="bulk-email-csv"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Choose CSV File
          </label>
          <input
            id="bulk-email-csv"
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          />
          <p className="mt-2 text-xs text-slate-400">
            Expected columns:{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5">
              email
            </code>{" "}
            (required),{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5">
              name
            </code>{" "}
            (optional). Extra columns are ignored.
          </p>
        </div>
      )}

      {/* ── Parse error ── */}
      {parseError && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3"
        >
          <p className="text-sm font-medium text-red-700">
            {parseError}
          </p>
        </div>
      )}

      {/* ── Recipient summary + validation errors (ready state) ── */}
      {cardState === "ready" && (
        <div className="mt-4">
          {/* Summary badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {validRecipients.length}{" "}
              {validRecipients.length === 1
                ? "valid recipient"
                : "valid recipients"}
            </span>

            {invalidRows.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {invalidRows.length}{" "}
                {invalidRows.length === 1
                  ? "invalid recipient"
                  : "invalid recipients"}
              </span>
            )}
          </div>

          {/* Invalid row details */}
          {invalidRows.length > 0 && (
            <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-3 space-y-1">
              <p className="text-xs font-semibold text-amber-800 mb-2">
                Rows with errors (skipped):
              </p>
              {invalidRows.map((row) => (
                <p
                  key={`${row.row}-${row.reason}`}
                  className="text-xs text-amber-700"
                >
                  <span className="font-semibold">
                    Row {row.row}:
                  </span>{" "}
                  {row.reason}
                </p>
              ))}
            </div>
          )}

          {/* Subject input */}
          <div className="mt-4">
            <label
              htmlFor="bulk-email-subject"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Subject
            </label>
            <input
              id="bulk-email-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Event Update"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Message textarea */}
          <div className="mt-4">
            <label
              htmlFor="bulk-email-message"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Message
            </label>
            <textarea
              id="bulk-email-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder={`Hello {{name}},\n\nWrite your message here…`}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 resize-y"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Use{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5">
                {`{{name}}`}
              </code>{" "}
              to personalise. Falls back to{" "}
              <em>&quot;there&quot;</em> when a name isn&apos;t provided.
            </p>
          </div>

          {/* Send button */}
          <button
            id="bulk-email-send-btn"
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send Bulk Email
          </button>
        </div>
      )}

      {/* ── Sending spinner ── */}
      {cardState === "sending" && (
        <div className="mt-4">
          <p
            role="status"
            className="text-sm text-slate-500"
          >
            Sending emails…
          </p>
          <button
            type="button"
            disabled
            className="mt-4 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white opacity-60 cursor-not-allowed"
          >
            Send Bulk Email
          </button>
        </div>
      )}

      {/* ── Success ── */}
      {cardState === "success" && sendResult && (
        <div
          role="status"
          className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
        >
          <p className="text-sm font-semibold text-emerald-800">
            ✓ Bulk email completed
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            {sendResult.sent} sent · {sendResult.failed} failed
          </p>
        </div>
      )}

      {/* ── Partial success ── */}
      {cardState === "partial" && sendResult && (
        <div
          role="status"
          className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4"
        >
          <p className="text-sm font-semibold text-amber-800">
            Bulk email partially completed
          </p>
          <p className="mt-1 text-sm text-amber-700">
            {sendResult.sent} sent · {sendResult.failed} failed
          </p>
        </div>
      )}

      {/* ── Error ── */}
      {cardState === "error" && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <p className="text-sm font-semibold text-red-800">
            Unable to send emails.
          </p>
          {sendError && (
            <p className="mt-1 text-sm text-red-700">{sendError}</p>
          )}
          <p className="mt-1 text-sm text-red-600">
            Please try again.
          </p>
        </div>
      )}
    </div>
  );
}
