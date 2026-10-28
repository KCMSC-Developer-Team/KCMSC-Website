import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { InstitutionalLanding } from "@/components/content/InstitutionalLanding";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { if (!isLocale((await params).locale)) notFound(); return <InstitutionalLanding locale={(await params).locale as Locale} page="routine" />; }
