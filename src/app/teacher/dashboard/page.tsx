import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import TeacherDashboard from "./TeacherDashboard";
export const dynamic="force-dynamic";
export default async function TeacherDashboardPage(){const session=await getServerSession(authOptions);if(!session?.user)redirect("/teacher/login");if(session.user.role!=="TEACHER")redirect("/admin");const teacher=await prisma.teacherProfile.findUnique({where:{userId:session.user.id}});if(!teacher||!teacher.isActive)redirect("/teacher/login");return <TeacherDashboard teacher={{id:teacher.id,staffId:teacher.staffId,name:teacher.name,designation:teacher.designation,wing:teacher.wing,subjects:teacher.subjects,photoUrl:teacher.photoUrl,highestDegree:teacher.highestDegree,university:teacher.university,qualifications:teacher.qualifications,quote:teacher.quote,biography:teacher.biography,studentMessage:teacher.studentMessage,mustChangePassword:teacher.mustChangePassword,isPublished:teacher.isPublished}}/>}
