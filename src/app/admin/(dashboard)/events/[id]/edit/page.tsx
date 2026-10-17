import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EventForm } from "../../EventForm";
import { updateEventAction } from "../../actions";
export default async function EditEventPage({params}:{params:{id:string}}){const event=await prisma.event.findUnique({where:{id:params.id}});if(!event)notFound();let photoUrls=event.photoUrls;try{photoUrls=JSON.parse(event.photoUrls||"[]").join("\n")}catch{}const action=updateEventAction.bind(null,event.id);return <div><a href="/admin/events" className="mb-4 inline-block text-sm text-primary hover:underline">← All events</a><h1 className="font-heading text-2xl text-ink">Edit event</h1><p className="mt-2 mb-6 text-sm text-ink-muted">Changes will appear on Student Life once the event is published.</p><EventForm action={action} defaults={{...event,photoUrls}}/></div>}
