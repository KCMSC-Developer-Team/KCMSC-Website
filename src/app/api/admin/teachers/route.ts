import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { revalidatePath } from "next/cache";
export const runtime = "nodejs";
function clean(v:unknown){return typeof v==="string"?v.trim():""}
async function saveTeacher(row:any){const staffId=clean(row.staffId);const name=clean(row.name);if(!staffId||!name)throw new Error("Each teacher needs a staff ID and name.");const designation=clean(row.designation)||"Teacher";const wing=clean(row.wing)||"Unassigned";const subjects=Array.isArray(row.subjects)?row.subjects.map(clean).filter(Boolean):[];const existing=await prisma.teacherProfile.findUnique({where:{staffId},include:{user:true}});const email=`${staffId.toLowerCase().replace(/[^a-z0-9._-]/g,"")}@teacher.kcmsc.local`;if(existing){const preserveMissing=Boolean(row.preserveMissing);return prisma.teacherProfile.update({where:{staffId},data:{name,designation,wing:preserveMissing&&!clean(row.wing)?existing.wing:wing,subjects:preserveMissing&&!subjects.length?existing.subjects:subjects,highestDegree:preserveMissing&&!clean(row.highestDegree)?existing.highestDegree:(clean(row.highestDegree)||null),university:preserveMissing&&!clean(row.university)?existing.university:(clean(row.university)||null),photoUrl:preserveMissing&&!clean(row.photoUrl)?existing.photoUrl:(clean(row.photoUrl)||null),qualifications:preserveMissing&&!clean(row.qualifications)?existing.qualifications:(clean(row.qualifications)||null),quote:preserveMissing&&!clean(row.quote)?existing.quote:(clean(row.quote)||null),biography:preserveMissing&&!clean(row.biography)?existing.biography:(clean(row.biography)||null),studentMessage:preserveMissing&&!clean(row.studentMessage)?existing.studentMessage:(clean(row.studentMessage)||null),...(typeof row.isPublished==="boolean"?{isPublished:row.isPublished}:{})}})}const clash=await prisma.user.findUnique({where:{email}});if(clash)throw new Error(`Generated account identifier conflicts for staff ID ${staffId}.`);const user=await prisma.user.create({data:{email,name,passwordHash:await hashPassword(staffId),role:"TEACHER"}});return prisma.teacherProfile.create({data:{userId:user.id,staffId,name,designation,wing,subjects,highestDegree:clean(row.highestDegree)||null,university:clean(row.university)||null,photoUrl:clean(row.photoUrl)||null,qualifications:clean(row.qualifications)||null,quote:clean(row.quote)||null,biography:clean(row.biography)||null,studentMessage:clean(row.studentMessage)||null,isPublished:Boolean(row.isPublished),mustChangePassword:true}})}
export async function POST(req:Request){if(!await getCurrentAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});try{const body=await req.json();const teacher=await saveTeacher(body);revalidatePath("/en/teachers");revalidatePath("/bn/teachers");return NextResponse.json({teacher},{status:201})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Unable to create teacher"},{status:400})}}
export async function PUT(req:Request){if(!await getCurrentAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});try{const {rows}=await req.json();if(!Array.isArray(rows)||rows.length>1000)return NextResponse.json({error:"Upload must contain between 1 and 1000 rows."},{status:400});let created=0,updated=0,skipped=0;const errors:string[]=[];for(let i=0;i<rows.length;i++){const row=rows[i];try{const old=await prisma.teacherProfile.findUnique({where:{staffId:String(row.staffId||"").trim()}});await saveTeacher({...row,preserveMissing:true});if(old)updated++;else created++}catch(e){skipped++;if(errors.length<12)errors.push(`Row ${i+2}: ${e instanceof Error?e.message:"invalid row"}`)}}const teachers=await prisma.teacherProfile.findMany({orderBy:[{wing:"asc"},{name:"asc"}]});revalidatePath("/en/teachers");revalidatePath("/bn/teachers");return NextResponse.json({created,updated,skipped,errors,teachers})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Import failed"},{status:400})}}
export async function PATCH(req:Request){
  if(!await getCurrentAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
  try{
    const body=await req.json();
    const data:any={};
    if(typeof body.isPublished==="boolean")data.isPublished=body.isPublished;
    if(typeof body.isActive==="boolean")data.isActive=body.isActive;
    if(!Object.keys(data).length)return NextResponse.json({error:"No valid changes supplied"},{status:400});

    // Bulk action: update selected teacher profiles in one database operation.
    if(Array.isArray(body.ids)){
      const rawIds = (body.ids as unknown[]).filter(
        (id): id is string => typeof id === "string" && id.trim().length > 0
      );
      const ids = Array.from(new Set(rawIds.map((id) => id.trim())));
      if(!ids.length)return NextResponse.json({error:"Select at least one teacher."},{status:400});
      if(ids.length>1000)return NextResponse.json({error:"You can update at most 1000 teachers at once."},{status:400});
      const result=await prisma.teacherProfile.updateMany({where:{id:{in:ids}},data});
      revalidatePath("/en/teachers");revalidatePath("/bn/teachers");
      return NextResponse.json({updated:result.count,ids,isPublished:data.isPublished,isActive:data.isActive});
    }

    const teacher=await prisma.teacherProfile.update({where:{id:String(body.id)},data});
    revalidatePath("/en/teachers");revalidatePath("/bn/teachers");
    return NextResponse.json({teacher});
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Update failed"},{status:400})}
}

export async function DELETE(req: Request) {
  if (!await getCurrentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const ids: string[] = Array.isArray(body.ids)
      ? Array.from(new Set<string>((body.ids as unknown[]).filter((id): id is string => typeof id === "string" && id.trim().length > 0).map((id) => id.trim())))
      : [];
    if (!ids.length) return NextResponse.json({ error: "Select at least one teacher to delete." }, { status: 400 });
    if (ids.length > 1000) return NextResponse.json({ error: "You can delete at most 1000 teachers at once." }, { status: 400 });

    const existing = await prisma.teacherProfile.findMany({ where: { id: { in: ids } }, select: { id: true, userId: true } });
    if (!existing.length) return NextResponse.json({ error: "No matching teacher records were found." }, { status: 404 });

    // Deleting linked users cascades to TeacherProfile and prevents orphaned login accounts.
    await prisma.$transaction(async (tx) => {
      await tx.user.deleteMany({ where: { id: { in: existing.map((teacher) => teacher.userId) }, role: "TEACHER" } });
    });

    const deletedIds = existing.map((teacher) => teacher.id);
    revalidatePath("/en/teachers");
    revalidatePath("/bn/teachers");
    return NextResponse.json({ deleted: deletedIds.length, deletedIds });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to delete teachers." }, { status: 400 });
  }
}

