"use client";

import { useState } from "react";

import EventDetails from "@/components/certificate/EventDetails";
import ParticipantsUpload from "@/components/certificate/ParticipantsUpload";
import TemplateSelector from "@/components/certificate/TemplateSelector";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import type { TemplateType } from "@/types/certificate";

export default function Home() {
  const [eventName, setEventName] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType | null>(null);
  const [customTemplate, setCustomTemplate] =
    useState<File | null>(null);
  const [participantsFile, setParticipantsFile] =
    useState<File | null>(null);

  return (
    <>
      <Header />

      <PageContainer>
        <section className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-slate-500">
              Certificate workspace
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Create certificates
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Generate personalized certificates for your event using a
              template and participant list.
            </p>
          </div>

          <div className="space-y-6">
            <EventDetails
              eventName={eventName}
              onEventNameChange={setEventName}
            />

            <TemplateSelector
              selectedTemplate={selectedTemplate}
              customTemplate={customTemplate}
              onTemplateChange={setSelectedTemplate}
              onCustomTemplateChange={setCustomTemplate}
            />

            <ParticipantsUpload
              file={participantsFile}
              onFileChange={setParticipantsFile}
            />
          </div>
        </section>
      </PageContainer>
    </>
  );
}