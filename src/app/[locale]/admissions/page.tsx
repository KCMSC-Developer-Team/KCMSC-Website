import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function AdmissionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if (!isLocale((await params).locale)) notFound();

  const locale: Locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const page = dict.admissionsPage;

  return (
    <>
      <PageHeader heading={page.heading} intro={page.intro} />

      <section className="kc-page-shell border-b border-[var(--kc-line)]">
        <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
          <div className="kc-card p-6 sm:p-8">
            <p className="kc-section-label">{page.processHeading}</p>
            <h2 className="mt-3 font-heading text-2xl font-normal text-[var(--kc-green-dark)]">
              {page.processHeading}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--kc-muted)]">
              {page.processBody}
            </p>
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

          <div className="mt-6 border-t border-[var(--kc-line)] pt-7">
            <p className="max-w-2xl text-sm leading-7 text-[var(--kc-muted)]">
              {page.contactNote}
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
