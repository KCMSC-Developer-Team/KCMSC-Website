import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AlumniForm } from "../../AlumniForm";
import { updateAlumniAction } from "../../actions";

export default async function EditAlumniPage({ params }: { params: Promise<{ id: string }> }) {
  const alumni = await prisma.alumniMessage.findUnique({ where: { id: (await params).id } });
  if (!alumni) notFound();

  const action = updateAlumniAction.bind(null, alumni.id);

  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Edit alumni message</h1>
      <div className="mt-6">
        <AlumniForm action={action} defaults={alumni} />
      </div>
    </div>
  );
}
