import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCycleByIdSafe } from "@/lib/admissions";
import { ApplicationForm } from "../ApplicationForm";
import { createApplicationAction } from "../actions";

export const dynamic = "force-dynamic";

function formatDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric", month: "long", year: "numeric"
  }).format(date);
}

export default async function ApplyCyclePage({
  params,
  searchParams
}: {
  params: { locale: string; cycleId: string };
  searchParams: { error?: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const page = dict.admissionsApplyPage;
  const cycle = await getCycleByIdSafe(params.cycleId);

  if (!cycle) notFound();

  const now = new Date();
  const isOpen = now >= cycle.opensAt && now <= cycle.closesAt;

  if (!isOpen) {
    return (
      <>
        <PageHeader
          heading={page.heading}
          intro={locale === "bn" ? cycle.nameBn : cycle.nameEn}
        />
        <section className="kc-page-shell">
          <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <div className="kc-card border-dashed px-6 py-12 text-center sm:px-10">
              <p className="kc-section-label">{locale === "bn" ? "আবেদন বন্ধ" : "Applications closed"}</p>
              <h2 className="mt-3 font-heading text-3xl text-[var(--kc-green-dark)]">{page.closedHeading}</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--kc-muted)]">{page.closedBody}</p>
              <Link href={`/${locale}/admissions`} className="kc-classic-button kc-classic-button-outline mt-7">
                {locale === "bn" ? "ভর্তি পাতায় ফিরে যান" : "Back to admissions"}
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const boundAction = createApplicationAction.bind(null, locale, cycle.id);

  return (
    <>
      <PageHeader
        heading={page.heading}
        intro={locale === "bn" ? cycle.nameBn : cycle.nameEn}
      />

      <section className="kc-page-shell border-b border-[var(--kc-line)]">
        <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
          <div className="mb-8 flex flex-col gap-5 border-b border-[var(--kc-line)] pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="kc-section-label">{locale === "bn" ? "নির্বাচিত ভর্তি কার্যক্রম" : "Selected admission cycle"}</p>
              <h2 className="mt-2 font-heading text-2xl text-[var(--kc-green-dark)]">{locale === "bn" ? cycle.nameBn : cycle.nameEn}</h2>
            </div>
            <div className="text-xs leading-6 text-[var(--kc-muted)] sm:text-right">
              <div>{formatDate(cycle.opensAt, locale)} — {formatDate(cycle.closesAt, locale)}</div>
              <Link href={`/${locale}/admissions`} className="kc-classic-link mt-1">{locale === "bn" ? "অন্য ভর্তি কার্যক্রম বেছে নিন" : "Choose a different cycle"} <span aria-hidden="true">→</span></Link>
            </div>
          </div>

          {searchParams.error === "invalid" ? (
            <p className="mb-6 border border-[#a7473b]/30 bg-[#a7473b]/5 px-4 py-3 text-sm text-[#8c3c32]">
              {locale === "bn"
                ? "আগের আবেদনটি সম্পন্ন হয়নি। ফর্মে নির্দিষ্ট সমস্যাগুলো এখন দেখানো হবে। আপনার তথ্য আবার পূরণ করে জমা দিন; সার্ভারে আবেদন সংরক্ষিত হয়েছে বলে ধরে নেবেন না।"
                : "The previous submission was not completed. Specific validation errors will now appear directly in the form. Please submit again; do not assume an application was saved."}
            </p>
          ) : null}

          <ApplicationForm
            action={boundAction}
            sections={{
              student: locale === "bn" ? "শিক্ষার্থীর তথ্য" : "Student Information",
              father: locale === "bn" ? "পিতার তথ্য" : "Father's Information",
              mother: locale === "bn" ? "মাতার তথ্য" : "Mother's Information",
              guardians: locale === "bn" ? "অতিরিক্ত অভিভাবকের তথ্য" : "Additional Guardians",
              address: locale === "bn" ? "ঠিকানা" : "Address"
            }}
            fields={page.fields}
            submitLabel={page.submit}
            submittingLabel={page.submitting}
          />
        </div>
      </section>
    </>
  );
}
