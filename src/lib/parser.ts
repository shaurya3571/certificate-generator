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

export function parseParticipantsCsv(
  file: File,
): Promise<CsvParseResult> {
  return new Promise((resolve) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),

      complete: (results) => {
        const participants: Participant[] = [];
        const errors: string[] = [];

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