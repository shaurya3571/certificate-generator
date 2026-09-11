"use client";

import TemplateCard from "@/components/certificate/TemplateCard";
import type { TemplateType } from "@/types/certificate";

interface TemplateSelectorProps {
  selectedTemplate: TemplateType | null;
  onTemplateChange: (template: TemplateType) => void;
}

const templates = [
  {
    id: "classic" as const,
    name: "Classic",
    description: "A traditional certificate design with an elegant layout.",
    preview: "classic" as const,
  },
  {
    id: "modern" as const,
    name: "Modern",
    description: "A clean contemporary design suitable for workshops and events.",
    preview: "modern" as const,
  },
];

export default function TemplateSelector({
  selectedTemplate,
  onTemplateChange,
}: TemplateSelectorProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
          02
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Certificate template
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Choose a design for the certificates you want to generate.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            name={template.name}
            description={template.description}
            preview={template.preview}
            selected={selectedTemplate === template.id}
            onSelect={() => onTemplateChange(template.id)}
          />
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-medium text-slate-900">
              Upload your own template
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Use your organization&apos;s existing certificate design.
            </p>
          </div>

          <button
                type="button"
                onClick={() => onTemplateChange("custom")}
                aria-pressed={selectedTemplate === "custom"}
                className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                selectedTemplate === "custom"
                     ? "border-slate-900 bg-slate-900 text-white"
                     : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
  }`}
>
  {selectedTemplate === "custom"
    ? "Selected"
    : "Upload template"}
</button>
        </div>
      </div>
    </section>
  );
}