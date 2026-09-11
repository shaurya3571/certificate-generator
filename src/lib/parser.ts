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
         * Validate required headers before processing rows.
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
         * Convert parsed rows into Participant objects.
         * Detailed row validation comes in Step 3C.
         */
        const participants: Participant[] = [];

        for (const row of results.data) {
          const name = row.name?.trim() ?? "";
          const email = row.email?.trim() ?? "";

          if (!name && !email) {
            continue;
          }

          participants.push({
            name,
            email,
          });
        }

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