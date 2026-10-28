import { redirect } from "next/navigation";

export default async function AchievementsPage({ params }: { params: Promise<{ locale: string }> }) {
  redirect(`/${(await params).locale}/academics`);
}
