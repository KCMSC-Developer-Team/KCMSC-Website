import type { HelpArticle } from "@prisma/client";

type Action = (formData: FormData) => void | Promise<void>;

const field = "mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-primary";

export function HelpArticleForm({ action, defaults }: { action: Action; defaults?: HelpArticle }) {
  return (
    <form action={action} className="max-w-4xl space-y-5 rounded-xl border border-border bg-white p-5 sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">Question (English)<input name="questionEn" required maxLength={300} defaultValue={defaults?.questionEn} className={field} /></label>
        <label className="block text-sm font-medium text-ink">প্রশ্ন (বাংলা)<input name="questionBn" required maxLength={300} defaultValue={defaults?.questionBn} className={field} /></label>
        <label className="block text-sm font-medium text-ink">URL slug<input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={defaults?.slug} placeholder="admission-fees" className={field} /><span className="mt-1 block text-xs font-normal text-ink-muted">Lowercase letters, numbers and hyphens only.</span></label>
        <label className="block text-sm font-medium text-ink">Display order<input name="sortOrder" type="number" min="0" max="9999" defaultValue={defaults?.sortOrder ?? 100} className={field} /></label>
        <label className="block text-sm font-medium text-ink">Category (English)<input name="categoryEn" required defaultValue={defaults?.categoryEn} placeholder="Admissions" className={field} /></label>
        <label className="block text-sm font-medium text-ink">বিভাগ (বাংলা)<input name="categoryBn" required defaultValue={defaults?.categoryBn} placeholder="ভর্তি সংক্রান্ত" className={field} /></label>
      </div>
      <label className="block text-sm font-medium text-ink">Answer (English)<textarea name="answerEn" required rows={6} maxLength={12000} defaultValue={defaults?.answerEn} className={field} /></label>
      <label className="block text-sm font-medium text-ink">উত্তর (বাংলা)<textarea name="answerBn" required rows={6} maxLength={12000} defaultValue={defaults?.answerBn} className={field} /></label>
      <div className="flex flex-wrap gap-5 text-sm text-ink">
        <label className="flex items-center gap-2"><input type="checkbox" name="isPublished" defaultChecked={defaults?.isPublished ?? false} /> Published</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="isFeatured" defaultChecked={defaults?.isFeatured ?? false} /> Feature on Help Center</label>
      </div>
      <div className="flex flex-wrap gap-3"><button className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark" type="submit">{defaults ? "Save changes" : "Create article"}</button><a href="/admin/help" className="rounded-full border border-border px-5 py-2.5 text-sm text-ink hover:bg-[#f8f7f2]">Cancel</a></div>
    </form>
  );
}
