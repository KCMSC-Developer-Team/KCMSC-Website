import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if (!isLocale((await params).locale)) notFound();

  const locale: Locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const page = dict.contactPage;

  return (
    <>
      <PageHeader heading={page.heading} intro={page.intro} />

      <section className="mx-auto max-w-content px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2">
          <address className="not-italic">
            <dl className="space-y-4 text-ink">
              <div>
                <dt className="text-sm text-ink-muted">
                  {locale === "bn" ? "ঠিকানা" : "Address"}
                </dt>
                <dd>{dict.footer.address}</dd>
              </div>

              <div>
                <dt className="text-sm text-ink-muted">
                  {locale === "bn" ? "ফোন" : "Phone"}
                </dt>
                <dd>{dict.footer.phone}</dd>
              </div>

              <div>
                <dt className="text-sm text-ink-muted">
                  {locale === "bn" ? "মোবাইল" : "Mobile"}
                </dt>
                <dd>{dict.footer.mobile}</dd>
              </div>

              <div>
                <dt className="text-sm text-ink-muted">Email</dt>
                <dd>
                  <a
                    href={`mailto:${dict.footer.email}`}
                    className="text-primary hover:underline"
                  >
                    {dict.footer.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-sm text-ink-muted">Website</dt>
                <dd>{dict.footer.website}</dd>
              </div>
            </dl>
          </address>

          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="p-6 pb-4">
              <p className="text-sm text-ink-muted">
                {locale === "bn"
                  ? "উত্তরার কাছে দক্ষিণখানে অবস্থিত ক্যাম্পাসটির অবস্থান গুগল ম্যাপে দেখুন।"
                  : "See the campus location — near Uttara, Dakshinkhan — on Google Maps."}
              </p>
            </div>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7297.776086443836!2d90.41308!3d23.858109!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c5c555555555%3A0x89fc3a22dc626e58!2sK%20C%20MODEL%20SCHOOL%20%26%20COLLEGE!5e0!3m2!1sen!2sbd!4v1791212644537!5m2!1sen!2sbd"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-[320px] w-full sm:h-[380px] lg:h-[450px]"
              title="K C Model School & College location"
            />
          </div>
        </div>
      </section>
    </>
  );
}
