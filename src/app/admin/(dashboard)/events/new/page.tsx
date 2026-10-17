import { EventForm } from "../EventForm";
import { createEventAction } from "../actions";
export default function NewEventPage(){return <div><LinkBack/><h1 className="font-heading text-2xl text-ink">Create event</h1><p className="mt-2 mb-6 text-sm text-ink-muted">Draft the event in English and Bangla, add dates and photos, then publish when ready.</p><EventForm action={createEventAction}/></div>}
function LinkBack(){return <a href="/admin/events" className="mb-4 inline-block text-sm text-primary hover:underline">← All events</a>}
