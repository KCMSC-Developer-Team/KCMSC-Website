"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logAudit } from "@/lib/audit";

const schema = z.object({
 titleEn:z.string().trim().min(1).max(180), titleBn:z.string().trim().min(1).max(180),
 summaryEn:z.string().trim().min(1).max(500), summaryBn:z.string().trim().min(1).max(500),
 descriptionEn:z.string().trim().min(1).max(30000), descriptionBn:z.string().trim().min(1).max(30000),
 coverImage:z.string().max(1_000_000).optional(), photoUrls:z.string().max(10000).optional(),
 venueEn:z.string().max(180).optional(), venueBn:z.string().max(180).optional(), startAt:z.string().min(1), endAt:z.string().optional(),
 isPublished:z.boolean(), isFeatured:z.boolean()
});
function parse(form:FormData) {
 const coverImage=String(form.get("coverImage")||"");
 if(coverImage && !/^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(coverImage)) throw new Error("Invalid cover image. Upload JPG, PNG or WebP.");
 const raw=schema.parse({titleEn:form.get("titleEn"),titleBn:form.get("titleBn"),summaryEn:form.get("summaryEn"),summaryBn:form.get("summaryBn"),descriptionEn:form.get("descriptionEn"),descriptionBn:form.get("descriptionBn"),coverImage:coverImage||undefined,photoUrls:form.get("photoUrls")||"",venueEn:form.get("venueEn")||"",venueBn:form.get("venueBn")||"",startAt:form.get("startAt"),endAt:form.get("endAt")||undefined,isPublished:form.get("isPublished")==="on",isFeatured:form.get("isFeatured")==="on"});
 const urls=(raw.photoUrls||"").split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 if(urls.some(url=>!/^https?:\/\//i.test(url) && !url.startsWith("/"))) throw new Error("Gallery photos must use https:// URLs or local paths beginning with /.");
 return {...raw, photoUrls:JSON.stringify(urls), venueEn:raw.venueEn||null,venueBn:raw.venueBn||null,coverImage:raw.coverImage||null,startAt:new Date(raw.startAt),endAt:raw.endAt?new Date(raw.endAt):null};
}
function refresh(){ for(const path of ["/admin/events","/en/student-life","/bn/student-life","/en","/bn"]) revalidatePath(path); }
export async function createEventAction(form:FormData){const actor=await requireAdmin();const data=parse(form);const event=await prisma.event.create({data});await logAudit({userId:actor.id,actorLabel:actor.email,action:"CREATE_EVENT",targetType:"Event",targetId:event.id});refresh();redirect("/admin/events");}
export async function updateEventAction(id:string,form:FormData){const actor=await requireAdmin();const data=parse(form);await prisma.event.update({where:{id},data});await logAudit({userId:actor.id,actorLabel:actor.email,action:"UPDATE_EVENT",targetType:"Event",targetId:id});refresh();redirect("/admin/events");}
export async function deleteEventAction(form:FormData){const actor=await requireAdmin();const id=String(form.get("id")||"");if(!id)return;await prisma.event.delete({where:{id}});await logAudit({userId:actor.id,actorLabel:actor.email,action:"DELETE_EVENT",targetType:"Event",targetId:id});refresh();}
