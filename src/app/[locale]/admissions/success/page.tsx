import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function ApplicationSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ application?: string; download?: string }>;
}) {
  if (!isLocale((await params).locale)) notFound();
  const locale: Locale = (await params).locale as Locale;
  const page = getDictionary(locale).admissionsSuccessPage;
  const { application, download } = await searchParams;
  const downloadUrl = application && download
    ? `/api/admissions/${encodeURIComponent(application)}/form?token=${encodeURIComponent(download)}`
    : null;

  return (
    <>
      <PageHeader
        heading={page.heading}
        intro={locale === "bn" ? "আপনার আবেদন সফলভাবে জমা হয়েছে। আবেদন ফর্মটি ডাউনলোড করে ভবিষ্যতের জন্য সংরক্ষণ করুন।" : "Your application has been submitted successfully. Download and keep a copy of your application form."}
      />
      <section className="kc-page-shell">
        <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl rounded-2xl border border-[#dfe5df] bg-white p-8 text-center shadow-[0_14px_45px_rgba(15,23,42,0.07)] sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f2ea] text-2xl text-[var(--kc-green)]">✓</div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--kc-green)]">Application received</p>
            <h2 className="mt-2 font-heading text-3xl text-[var(--kc-green-dark)]">Application Submitted</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--kc-muted)]">Your application has been saved successfully. Download the official PDF copy below and keep it for your records.</p>
            {downloadUrl ? (
              <a href={downloadUrl} download className="kc-classic-button mt-8 inline-flex min-w-[220px] items-center justify-center">
                Download application PDF
              </a>
            ) : null}
            <p className="mt-4 text-xs text-[var(--kc-muted)]">The download is generated from the submitted application data.</p>
          </div>
        </div>
      </section>
    </>
  );
}
