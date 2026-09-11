import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";

export default function Home() {
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

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Certificate details
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Complete the steps below to prepare your certificates.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <span className="text-xs font-semibold text-slate-500">
                  STEP 01
                </span>

                <h4 className="mt-2 font-medium text-slate-900">
                  Event
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Add your event details.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <span className="text-xs font-semibold text-slate-500">
                  STEP 02
                </span>

                <h4 className="mt-2 font-medium text-slate-900">
                  Template
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a certificate design.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <span className="text-xs font-semibold text-slate-500">
                  STEP 03
                </span>

                <h4 className="mt-2 font-medium text-slate-900">
                  Participants
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Upload your participant list.
                </p>
              </div>
            </div>
          </div>
        </section>
      </PageContainer>
    </>
  );
}