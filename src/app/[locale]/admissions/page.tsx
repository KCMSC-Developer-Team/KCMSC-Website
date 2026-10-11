import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { getActiveCycleSafe } from "@/lib/admissions";

export const dynamic = "force-dynamic";

export default async function AdmissionsPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();

  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const page = dict.admissionsPage;
  const cycle = await getActiveCycleSafe();

  return (
    <>
      <PageHeader heading={page.heading} intro={page.intro} />

      <section className="kc-page-shell border-b border-[var(--kc-line)]">
        <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
          <div
            className={`kc-card p-6 sm:p-8 ${
              cycle
                ? "border-[#176b45]/30 bg-[#176b45]/[0.035]"
                : "bg-[var(--kc-paper)]"
            }`}
          >
            <p className="kc-section-label">
              {cycle ? page.openBanner : page.closedBanner}
            </p>

            {cycle ? (
              <>
                <h2 className="mt-3 font-heading text-2xl font-normal text-[var(--kc-green-dark)]">
                  {locale === "bn" ? cycle.nameBn : cycle.nameEn}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--kc-muted)]">
                  {locale === "bn"
                    ? "বর্তমান ভর্তি কার্যক্রমে অনলাইনে আবেদন করা যাচ্ছে।"
                    : "Online applications are currently being accepted for this admission cycle."}
                </p>
              </>
            ) : (
              <h2 className="mt-3 font-heading text-2xl font-normal text-[var(--kc-green-dark)]">
                {locale === "bn"
                  ? "এই মুহূর্তে কোনো ভর্তি কার্যক্রম চালু নেই"
                  : "There is no active admission cycle"}
              </h2>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {cycle ? (
                <Link
                  href={`/${locale}/admissions/apply/${encodeURIComponent(cycle.id)}`}
                  className="kc-classic-button kc-classic-button-primary"
                >
                  {page.applyCta}
                </Link>
              ) : null}

            </div>
          </div>

          <div className="mt-6 kc-card p-6 sm:p-8">
            <p className="kc-section-label">
              {locale === "bn" ? "শ্রেণি নির্ধারণ" : "Class Placement"}
            </p>

            <h2 className="mt-3 font-heading text-2xl font-normal text-[var(--kc-green-dark)]">
              {locale === "bn" ? "বয়স অনুযায়ী শ্রেণি" : "Age-based class placement"}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--kc-muted)]">
              {page.ageGroupsNote}
            </p>

            <Link
              href={`/${locale}/academics`}
              className="kc-classic-link mt-4"
            >
              {locale === "bn"
                ? "শিক্ষাব্যবস্থা সম্পর্কে দেখুন"
                : "See the Academics page"}{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-6 kc-card border-dashed p-6 sm:p-8">
            <p className="kc-section-label">{page.pendingHeading}</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--kc-muted)]">
              {page.pendingBody}
            </p>
          </div>

          <div className="mt-6 border-t border-[var(--kc-line)] pt-7">
            <p className="max-w-2xl text-sm leading-7 text-[var(--kc-muted)]">
              {page.onlinePortalNote}
            </p>

            <a
              href={`mailto:${dict.footer.email}`}
              className="kc-classic-button kc-classic-button-outline mt-5"
            >
              {page.contactCta}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
