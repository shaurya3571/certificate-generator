"use client";

import { useState } from "react";

import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import EventDetails from "@/components/certificate/EventDetails";

export default function Home() {
  const [eventName, setEventName] = useState("");

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
              Generate personalized certificates for your event using
              a template and participant list.
            </p>
          </div>

          <div className="space-y-6">
            <EventDetails
              eventName={eventName}
              onEventNameChange={setEventName}
            />

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
                  02
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Certificate template
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose a template for your certificates.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-sm font-medium text-slate-700">
                  Template selection coming next
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  You&apos;ll be able to choose a default template or
                  upload your own.
                </p>
              </div>
            </div>
          </div>
        </section>
      </PageContainer>
    </>
  );
}