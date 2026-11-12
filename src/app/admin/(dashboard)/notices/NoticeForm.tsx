import { SubmitButton } from "@/components/admin/SubmitButton";
import { NoticeImageField } from "./NoticeImageField";
import { toDhakaInputValue } from "@/lib/notice-format";

type NoticeDefaults = {
  titleEn?: string;
  titleBn?: string;
  bodyEn?: string;
  bodyBn?: string;
  isImportant?: boolean;
  isPublished?: boolean;
  imageUrls?: string[];
  noticeAt?: Date | null;
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

      <div>
        <label className="block text-sm font-medium text-ink">Notice date and time (Bangladesh time)</label>
        <input
          type="datetime-local"
          name="noticeAt"
          defaultValue={toDhakaInputValue(defaults.noticeAt)}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm sm:w-auto"
        />
        <p className="mt-1 text-xs text-ink-muted">Shown on the notice. Leave empty to use the publish time.</p>
      </div>

      <NoticeImageField defaultUrls={defaults.imageUrls ?? []} />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="isImportant" defaultChecked={defaults.isImportant} />
          Show as popup with photos (not on the top bar)
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="isPublished" defaultChecked={defaults.isPublished} />
          Published
        </label>
      </div>

      <p className="text-xs leading-5 text-ink-muted">
        Popup notices open as a popup on each page load or refresh of the website and are not shown on the top bar. Notices without the popup option appear as a scrolling title on the top bar, with a Read more link to the full notice. All published notices appear on the notices page.
      </p>

      <SubmitButton label="Save notice" pendingLabel="Saving…" />
    </form>
  );
}
