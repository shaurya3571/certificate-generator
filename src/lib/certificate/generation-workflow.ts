import type {
  Participant,
  TemplateType,
} from "@/types/certificate";
import type { DatabaseParticipant } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

import {
  createEvent,
} from "@/lib/supabase/events";

import {
  saveParticipants,
} from "@/lib/supabase/participants";

import {
  saveCertificates,
} from "@/lib/supabase/certificates";

import {
  generateCertificate,
} from "@/lib/certificate/generator";

import {
  generateCertificateId,
} from "@/lib/certificate/id";

type SupabaseDatabaseClient = SupabaseClient;

export interface GenerateAndSaveInput {
  eventName: string;
  template: TemplateType;
  participants: Participant[];
  organizerId: string;
}

export interface GeneratedDatabaseCertificate {
  participant: Participant;
  participantId: string;
  certificateId: string;
  fileName: string;
  data: Uint8Array;
}

export interface GenerateAndSaveResult {
  eventId: string;
  certificates: GeneratedDatabaseCertificate[];
}

export async function generateAndSaveCertificates(
  input: GenerateAndSaveInput,
  client: SupabaseDatabaseClient = supabase,
): Promise<GenerateAndSaveResult> {
  if (!input.eventName.trim()) {
    throw new Error("Event name is required.");
  }

  if (!input.organizerId.trim()) {
    throw new Error("Organizer ID is required.");
  }

  if (input.participants.length === 0) {
    throw new Error("No participants available.");
  }

  const event = await createEvent(
    {
      name: input.eventName,
      template: input.template,
      organizerId: input.organizerId,
    },
    client,
  );

  const savedParticipants =
    await saveParticipants(
      {
        eventId: event.id,
        participants: input.participants,
      },
      client,
    );

  const certificates: GeneratedDatabaseCertificate[] =
    [];

  const certificateRecords = [];

  const usedCertificateIds = new Set<string>();

  for (const participant of savedParticipants) {
    let certificateId = generateCertificateId();

    while (usedCertificateIds.has(certificateId)) {
      certificateId = generateCertificateId();
    }

    usedCertificateIds.add(certificateId);

    const certificatePdf =
      await generateCertificate({
        eventName: input.eventName,
        participantName: participant.name,
        certificateId,
        template: input.template,
      });

    const safeName = participant.name
      .trim()
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .replace(/\s+/g, "-");

    const fileName =
      `${safeName}-${certificateId}.pdf`;

    certificates.push({
      participant: {
        name: participant.name,
        email: participant.email,
      },
      participantId: participant.id,
      certificateId,
      fileName,
      data: certificatePdf,
    });

    certificateRecords.push({
      eventId: event.id,
      participantId: participant.id,
      certificateId,
      fileName,
      emailStatus: "pending" as const,
      emailError: null,
    });
  }

  await saveCertificates(certificateRecords, client);

  return {
    eventId: event.id,
    certificates,
  };
}

export interface GenerateForEventInput {
  eventId: string;
  eventName: string;
  template: TemplateType;
  participants: DatabaseParticipant[];
}

export async function generateCertificatesForEvent(
  input: GenerateForEventInput,
  client: SupabaseDatabaseClient = supabase,
): Promise<GeneratedDatabaseCertificate[]> {
  if (!input.eventId.trim()) {
    throw new Error("Event ID is required.");
  }

  if (!input.eventName.trim()) {
    throw new Error("Event name is required.");
  }

  if (input.participants.length === 0) {
    throw new Error("No participants available.");
  }

  const certificates: GeneratedDatabaseCertificate[] =
    [];

  const certificateRecords = [];

  const usedCertificateIds = new Set<string>();

  for (const participant of input.participants) {
    let certificateId = generateCertificateId();

    while (usedCertificateIds.has(certificateId)) {
      certificateId = generateCertificateId();
    }

    usedCertificateIds.add(certificateId);

    const certificatePdf =
      await generateCertificate({
        eventName: input.eventName,
        participantName: participant.name,
        certificateId,
        template: input.template,
      });

    const safeName = participant.name
      .trim()
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .replace(/\s+/g, "-");

    const fileName =
      `${safeName}-${certificateId}.pdf`;

    certificates.push({
      participant: {
        name: participant.name,
        email: participant.email,
      },
      participantId: participant.id,
      certificateId,
      fileName,
      data: certificatePdf,
    });

    certificateRecords.push({
      eventId: input.eventId,
      participantId: participant.id,
      certificateId,
      fileName,
      emailStatus: "pending" as const,
      emailError: null,
    });
  }

  await saveCertificates(certificateRecords, client);

  return certificates;
}