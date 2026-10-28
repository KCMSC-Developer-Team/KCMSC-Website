import { redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";

export default async function ClubsPage({ params }: { params: Promise<{ locale: string }> }) {
  if (!isLocale((await params).locale)) redirect("/en/student-life");
  redirect(`/${(await params).locale}/student-life#clubs`);
}
