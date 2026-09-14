import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";

export default function VerifyPage() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Certificate Verification
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Verify a Certificate
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Check whether a certificate issued by Certificate Generator is
            genuine using its unique certificate ID.
          </p>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <label
              htmlFor="certificate-id"
              className="block text-sm font-semibold text-slate-900"
            >
              Certificate ID
            </label>

            <input
              id="certificate-id"
              name="certificate-id"
              type="text"
              placeholder="e.g. CERT-2026-305NDF"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <button
            type="button"
            className="mt-4 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Verify Certificate
          </button>
        </section>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-700 underline-offset-4 transition hover:text-slate-950 hover:underline focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Back to Certificate Generator
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}