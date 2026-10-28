import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CareerForm } from "../../CareerForm";
import { updateCareerAction } from "../../actions";

export default async function EditCareerPage({ params }: { params: Promise<{ id: string }> }) {
  const career = await prisma.career.findUnique({ where: { id: (await params).id } });
  if (!career) notFound();

  const boundAction = updateCareerAction.bind(null, career.id);

  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Edit Vacancy</h1>
      <div className="mt-6">
        <CareerForm action={boundAction} defaults={career} />
      </div>
    </div>
  );
}
