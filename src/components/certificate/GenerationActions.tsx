"use client";

import GenerateButton from "@/components/certificate/GenerateButton";

interface GenerationActionsProps {
  isReady: boolean;
  onGenerate: () => void;
}

export default function GenerationActions({
  isReady,
  onGenerate,
}: GenerationActionsProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Generate certificates
          </h3>

          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
            Once everything is ready, generate a personalized certificate
            for every participant.
          </p>
        </div>

        <GenerateButton
          disabled={!isReady}
          onClick={onGenerate}
        />
      </div>
    </section>
  );
}