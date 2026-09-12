"use client";

import { useState } from "react";
import Link from "next/link";

import EventDetails from "@/components/certificate/EventDetails";
import FormReadiness from "@/components/certificate/FormReadiness";
import { GenerationActions } from "@/components/certificate/GenerationActions";
import ParticipantsUpload from "@/components/certificate/ParticipantsUpload";
import TemplateSelector from "@/components/certificate/TemplateSelector";
import StepIndicator from "@/components/certificate/StepIndicator";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { EmailActions } from "@/components/certificate/EmailActions";
import type {
  Participant,
  TemplateType,
} from "@/types/certificate";

export default function Home() {
  const [eventName, setEventName] = useState("");

  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType | null>(null);

  const [customTemplate, setCustomTemplate] =
    useState<File | null>(null);

  const [participantsFile, setParticipantsFile] =
    useState<File | null>(null);

  const [participants, setParticipants] =
    useState<Participant[]>([]);

  return (
    <>
      <Header />

      <PageContainer>
        <section className="mx-auto max-w-4xl">
          {/* Page heading */}
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-slate-500">
              Certificate workspace
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Create certificates
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Generate personalized certificates for your event using a
              template and participant list.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="rounded-xl bg-gray-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Log In
              </Link>

              <Link
                href="/signup"
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-center text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <StepIndicator />

          {/* Workflow */}
          <div className="space-y-6">
            {/* Step 01 */}
            <EventDetails
              eventName={eventName}
              onEventNameChange={setEventName}
            />

            {/* Step 02 */}
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              customTemplate={customTemplate}
              onTemplateChange={setSelectedTemplate}
              onCustomTemplateChange={setCustomTemplate}
            />

            {/* Step 03 */}
            <ParticipantsUpload
              participants={participants}
              onParticipantsChange={setParticipants}
              onFileChange={setParticipantsFile}
            />

            {/* Generation checklist */}
            <FormReadiness
              eventName={eventName}
              selectedTemplate={selectedTemplate}
              customTemplate={customTemplate}
              participantsFile={participantsFile}
              participantCount={participants.length}
            />

            {/* Step 04 */}
            <GenerationActions
              eventName={eventName}
              template={selectedTemplate}
              participants={participants}
            />
            <EmailActions
              eventName={eventName}
              template={selectedTemplate}
              participants={participants}
            />
        
          </div>
        </section>
      </PageContainer>
    </>
  );
}
