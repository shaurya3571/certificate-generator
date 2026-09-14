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
        <section className="mx-auto max-w-5xl">
          {/* Page heading */}
          <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-14">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                Certificate workspace
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Create certificates
                <span className="block text-slate-500">
                  without the busywork.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Generate personalized certificates for your event
                using a template and participant list.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#certificate-workflow"
                  className="rounded-xl bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  Start Creating
                </a>

                <Link
                  href="/organizer"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  Organizer Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div id="certificate-workflow">
            <StepIndicator />
          </div>

          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">
              Certificate workflow
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Follow the steps below to prepare and generate your certificates.
            </p>
          </div>

          {/* Workflow */}
          <div className="space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <EventDetails
                eventName={eventName}
                onEventNameChange={setEventName}
              />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                customTemplate={customTemplate}
                onTemplateChange={setSelectedTemplate}
                onCustomTemplateChange={setCustomTemplate}
                isAuthenticated={Boolean(user)}
                onAuthRequired={handleAuthRequired}
              />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <ParticipantsUpload
                participants={participants}
                onParticipantsChange={setParticipants}
                onFileChange={setParticipantsFile}
                isAuthenticated={Boolean(user)}
                onAuthRequired={handleAuthRequired}
              />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <FormReadiness
                eventName={eventName}
                selectedTemplate={selectedTemplate}
                customTemplate={customTemplate}
                participantsFile={participantsFile}
                participantCount={participants.length}
              />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-bold tracking-tight text-slate-950">
                  Generation and email
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Generate certificates and send them to participants.
                </p>
              </div>

              <div className="space-y-5">
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
                className="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Log In
              </Link>

              <Link
                href="/signup"
                onClick={() => setShowAuthPrompt(false)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Sign Up
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setShowAuthPrompt(false)}
              className="mt-4 w-full rounded-xl px-4 py-2 text-center text-sm font-medium text-slate-500 transition hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Continue browsing
            </button>
          </div>
        </div>
      )}
    </>
  );
}
