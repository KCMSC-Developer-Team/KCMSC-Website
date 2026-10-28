import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AchievementForm } from "../../AchievementForm";
import { updateAchievementAction } from "../../actions";

export default async function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  const achievement = await prisma.achievement.findUnique({ where: { id: (await params).id } });
  if (!achievement) notFound();

  const boundAction = updateAchievementAction.bind(null, achievement.id);

  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Edit Achievement</h1>
      <div className="mt-6">
        <AchievementForm action={boundAction} defaults={achievement} />
      </div>
    </div>
  );
}
