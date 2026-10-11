import { redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";

export default function ClubsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) redirect("/en/student-life");
  redirect(`/${params.locale}/student-life#clubs`);
}
