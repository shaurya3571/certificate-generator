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
import { useAuth } from "@/components/auth/AuthProvider";
import type {
  Participant,
  TemplateType,
} from "@/types/certificate";

export default function Home() {
  const { user } = useAuth();

  const [eventName, setEventName] = useState("");
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType | null>(null);

  const [customTemplate, setCustomTemplate] =
    useState<File | null>(null);

  const [participantsFile, setParticipantsFile] =
    useState<File | null>(null);

  const [participants, setParticipants] =
    useState<Participant[]>([]);

  const handleAuthRequired = () => {
    if (!user) {
      setShowAuthPrompt(true);
    }
  };

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
              isAuthenticated={Boolean(user)}
              onAuthRequired={handleAuthRequired}
            />

            {/* Step 03 */}
            <ParticipantsUpload
              participants={participants}
              onParticipantsChange={setParticipants}
              onFileChange={setParticipantsFile}
              isAuthenticated={Boolean(user)}
              onAuthRequired={handleAuthRequired}
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
              isAuthenticated={Boolean(user)}
              onAuthRequired={handleAuthRequired}
            />
            <EmailActions
              eventName={eventName}
              template={selectedTemplate}
              participants={participants}
            />
        
          </div>
        </section>
      </PageContainer>

      {showAuthPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4"
          role="presentation"
          onClick={() => setShowAuthPrompt(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-prompt-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="auth-prompt-title"
              className="text-xl font-semibold text-slate-950"
            >
              Sign in to continue
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Please sign in or create an account before uploading files or generating certificates.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                onClick={() => setShowAuthPrompt(false)}
                className="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Log In
              </Link>

              <Link
                href="/signup"
                onClick={() => setShowAuthPrompt(false)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Sign Up
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setShowAuthPrompt(false)}
              className="mt-4 w-full text-center text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              Continue browsing
            </button>
          </div>
        </div>
      )}
    </>
  );
}
