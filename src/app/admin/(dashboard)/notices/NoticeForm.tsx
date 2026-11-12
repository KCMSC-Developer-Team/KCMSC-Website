import { SubmitButton } from "@/components/admin/SubmitButton";
import { NoticeImageField } from "./NoticeImageField";

type NoticeDefaults = {
  titleEn?: string;
  titleBn?: string;
  bodyEn?: string;
  bodyBn?: string;
  isImportant?: boolean;
  isPublished?: boolean;
  imageUrls?: string[];
};

export function NoticeForm({
  action,
  defaults = {}
}: {
  action: (formData: FormData) => void;
  defaults?: NoticeDefaults;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink">Title (English)</label>
          <input
            name="titleEn"
            required
            defaultValue={defaults.titleEn}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Title (বাংলা)</label>
          <input
            name="titleBn"
            required
            defaultValue={defaults.titleBn}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm font-bangla"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink">Body (English)</label>
          <textarea
            name="bodyEn"
            required
            rows={6}
            defaultValue={defaults.bodyEn}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Body (বাংলা)</label>
          <textarea
            name="bodyBn"
            required
            rows={6}
            defaultValue={defaults.bodyBn}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm font-bangla"
          />
        </div>
      </div>

      <NoticeImageField defaultUrls={defaults.imageUrls ?? []} />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="isImportant" defaultChecked={defaults.isImportant} />
          Show as popup on website
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="isPublished" defaultChecked={defaults.isPublished} />
          Published
        </label>
      </div>

      <p className="text-xs leading-5 text-ink-muted">When “Show as popup on website” and “Published” are enabled, this notice opens as a popup each time a visitor loads or refreshes the website. It does not reopen while they move between pages. The newest active notice is shown.</p>

      <SubmitButton label="Save notice" pendingLabel="Saving…" />
    </form>
  );
}
