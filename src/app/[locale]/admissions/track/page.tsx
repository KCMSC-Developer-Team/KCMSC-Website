import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function TrackPage({ params }: { params: Promise<{ locale: string }> }) {
  if (!isLocale((await params).locale)) notFound();
  const locale: Locale = (await params).locale as Locale;
  const page = getDictionary(locale).admissionsTrackPage;
  return <><PageHeader heading={page.heading} intro={locale === "bn" ? "এই ভর্তি ব্যবস্থায় ট্র্যাকিং নম্বর বা ফোন নম্বর দিয়ে আবেদনের অবস্থা দেখার সুবিধা নেই।" : "This admission system does not use tracking numbers or phone-based status lookup."}/><section className="mx-auto max-w-content px-6 py-16"><div className="max-w-xl rounded-lg border border-border bg-surface p-6"><p className="text-sm text-ink-muted">{locale === "bn" ? "আবেদন জমা দেওয়ার পর আপনার আবেদন ফর্মটি ডাউনলোড করে সংরক্ষণ করুন।" : "After submitting, download and keep your application form."}</p></div></section></>;
}
