/**
 * CSV parser for bulk-email recipients.
 *
 * Rules:
 *  - `email` column is required (column name matched case-insensitively).
 *  - `name` column is optional.
 *  - Extra columns are ignored.
 *  - Empty rows are skipped.
 *  - Invalid email addresses are rejected and reported by row number.
 *  - Duplicate emails (case-insensitive comparison) are rejected;
 *    only the first occurrence is kept.
 *
 * Row numbers are 1-based.  The header row is row 1, so the first data
 * row is row 2 — matching what the user would see in a spreadsheet app.
 */

export interface ParsedRecipient {
  /** Trimmed display name. Absent when the CSV has no `name` column or the cell is empty. */
  name?: string;
  /** Trimmed, lower-cased email address. */
  email: string;
}

export interface InvalidRow {
  /** 1-based row number (header = 1, first data row = 2). */
  row: number;
  reason: string;
}

export interface ParseResult {
  valid: ParsedRecipient[];
  invalid: InvalidRow[];
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

/**
 * Parse a CSV string into valid and invalid recipients.
 *
 * @param text - Raw CSV file content as a string.
 */
export function parseRecipientsCsv(text: string): ParseResult {
  const valid: ParsedRecipient[] = [];
  const invalid: InvalidRow[] = [];
  const seenEmails = new Set<string>();

  // Split into lines, preserving empty-line detection.
  const lines = text.split(/\r?\n/);

  if (lines.length === 0) {
    return { valid, invalid };
  }

  // ── Parse header ──────────────────────────────────────────────────────────
  const headerLine = lines[0];

  if (!headerLine?.trim()) {
    return { valid, invalid };
  }

  const headers = headerLine
    .split(",")
    .map((h) => h.trim().toLowerCase());

  const emailColIndex = headers.indexOf("email");
  const nameColIndex = headers.indexOf("name");

  if (emailColIndex === -1) {
    // Not a valid recipient CSV — no email column.
    invalid.push({
      row: 1,
      reason: 'No "email" column found in CSV header.',
    });
    return { valid, invalid };
  }

  // ── Parse data rows ───────────────────────────────────────────────────────
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const rowNumber = i + 1; // row 1 = header, so data starts at row 2

    // Skip blank lines.
    if (!line?.trim()) {
      continue;
    }

    const cells = line.split(",").map((c) => c.trim());

    const rawEmail = cells[emailColIndex] ?? "";
    const rawName =
      nameColIndex !== -1 ? (cells[nameColIndex] ?? "") : "";

    // ── Email validation ─────────────────────────────────────────────────
    if (!rawEmail) {
      invalid.push({ row: rowNumber, reason: "Email is missing." });
      continue;
    }

    if (!isValidEmail(rawEmail)) {
      invalid.push({
        row: rowNumber,
        reason: "Invalid email address.",
      });
      continue;
    }

    const normalisedEmail = rawEmail.toLowerCase();

    // ── Duplicate check ───────────────────────────────────────────────────
    if (seenEmails.has(normalisedEmail)) {
      invalid.push({
        row: rowNumber,
        reason: `Duplicate email address (${rawEmail}).`,
      });
      continue;
    }

    seenEmails.add(normalisedEmail);

    const recipient: ParsedRecipient = {
      email: normalisedEmail,
    };

    if (rawName) {
      recipient.name = rawName;
    }

    valid.push(recipient);
  }

  return { valid, invalid };
}
