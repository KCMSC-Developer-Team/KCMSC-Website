import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { InstitutionalLanding } from "@/components/content/InstitutionalLanding";
export default function Page({ params }: { params: { locale: string } }) { if (!isLocale(params.locale)) notFound(); return <InstitutionalLanding locale={params.locale as Locale} page="downloads" />; }
