import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LegacyApplyPage({ params }: { params: Promise<{ locale: string }> }) {
  redirect(`/${(await params).locale}/admissions`);
}
