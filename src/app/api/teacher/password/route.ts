import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
export async function POST(req:Request){const session=await getServerSession(authOptions);if(!session?.user||session.user.role!=="TEACHER")return NextResponse.json({error:"Unauthorized"},{status:401});try{const {password}=await req.json();if(typeof password!=="string"||password.length<10)return NextResponse.json({error:"Password must contain at least 10 characters."},{status:400});const profile=await prisma.teacherProfile.findUnique({where:{userId:session.user.id}});if(!profile||!profile.isActive)return NextResponse.json({error:"Teacher account unavailable."},{status:403});await prisma.user.update({where:{id:session.user.id},data:{passwordHash:await hashPassword(password)}});await prisma.teacherProfile.update({where:{id:profile.id},data:{mustChangePassword:false}});return NextResponse.json({ok:true})}catch{return NextResponse.json({error:"Unable to update password."},{status:400})}}
