import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { FacilityForm } from "../../FacilityForm";
import { updateFacilityAction } from "../../actions";

export default async function EditFacilityPage({ params }: { params: Promise<{ id: string }> }) {
  const facility = await prisma.facility.findUnique({ where: { id: (await params).id } });
  if (!facility) notFound();

  const boundAction = updateFacilityAction.bind(null, facility.id);

  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Edit Facility</h1>
      <div className="mt-6">
        <FacilityForm action={boundAction} defaults={facility} />
      </div>
    </div>
  );
}
