import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ClubForm } from "../../ClubForm";
import { updateClubAction } from "../../actions";

export default async function EditClubPage({ params }: { params: Promise<{ id: string }> }) {
  const club = await prisma.club.findUnique({ where: { id: (await params).id } });
  if (!club) notFound();

  const boundAction = updateClubAction.bind(null, club.id);

  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Edit Club</h1>
      <div className="mt-6">
        <ClubForm action={boundAction} defaults={club} />
      </div>
    </div>
  );
}
