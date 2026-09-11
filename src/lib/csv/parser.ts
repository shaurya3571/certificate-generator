import Papa from "papaparse";

import type { Participant } from "@/types/certificate";

export interface CsvParseResult {
  participants: Participant[];
  errors: string[];
}

interface CsvRow {
  name?: string;
  email?: string;
  [key: string]: string | undefined;
}

const REQUIRED_HEADERS = ["name", "email"];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function parseParticipantsCsv(
  file: File,
): Promise<CsvParseResult> {
  return new Promise((resolve) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,

      transformHeader: (header) =>
        header.trim().toLowerCase(),

      complete: (results) => {
        const errors: string[] = [];

        /*
         * Step 3B:
         * Validate required headers.
         */
        const headers = results.meta.fields ?? [];

        const normalizedHeaders = headers.map((header) =>
          header.trim().toLowerCase(),
        );

        const missingHeaders = REQUIRED_HEADERS.filter(
          (requiredHeader) =>
            !normalizedHeaders.includes(requiredHeader),
        );

        if (missingHeaders.length > 0) {
          errors.push(
            `Missing required column${
              missingHeaders.length > 1 ? "s" : ""
            }: ${missingHeaders.join(", ")}`,
          );

          resolve({
            participants: [],
            errors,
          });

          return;
        }

        /*
         * Step 3C:
         * Validate individual participant rows.
         */
        const participants: Participant[] = [];

        results.data.forEach((row, index) => {
          const csvRowNumber = index + 2;

          const name = row.name?.trim() ?? "";
          const email = row.email?.trim() ?? "";

          /*
           * Ignore completely empty rows.
           */
          if (!name && !email) {
            return;
          }

          /*
           * Name validation.
           */
          if (!name) {
            errors.push(
              `Row ${csvRowNumber}: name is required.`,
            );
          }

          /*
           * Email validation.
           */
          if (!email) {
            errors.push(
              `Row ${csvRowNumber}: email is required.`,
            );
          } else if (!isValidEmail(email)) {
            errors.push(
              `Row ${csvRowNumber}: invalid email address.`,
            );
          }

          /*
           * Only add completely valid rows.
           */
          if (name && email && isValidEmail(email)) {
            participants.push({
              name,
              email,
            });
          }
        });

        /*
         * Papa Parse structural errors.
         */
        for (const error of results.errors) {
          errors.push(
          `CSV error on row ${(error.row ?? 0) + 2}: ${error.message}`,
          );
        }

        resolve({
          participants,
          errors,
        });
      },

      error: (error) => {
        resolve({
          participants: [],
          errors: [error.message],
        });
      },
    });
  });
}