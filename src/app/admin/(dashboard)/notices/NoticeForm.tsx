import { SubmitButton } from "@/components/admin/SubmitButton";
import { NoticeImageField } from "./NoticeImageField";
import { toDhakaDateInputValue } from "@/lib/notice-format";

type NoticeDefaults = {
  titleEn?: string;
  titleBn?: string;
  bodyEn?: string;
  bodyBn?: string;
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
        <label className="block text-sm font-medium text-ink">Publishing date</label>
        <input
          type="date"
          name="noticeAt"
          required
          defaultValue={toDhakaDateInputValue(defaults.noticeAt)}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm sm:w-auto"
        />
        <p className="mt-1 text-xs text-ink-muted">This date is displayed publicly. Set it manually; only the date is shown, not a time.</p>
      </div>

      <NoticeImageField defaultUrls={defaults.imageUrls ?? []} />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="isPublished" defaultChecked={defaults.isPublished} />
          Published
        </label>
      </div>

      <p className="text-xs leading-5 text-ink-muted">
        Published notices appear as image-led news cards on the homepage and in the full notices and latest news page. A publishing date and at least one image are required before a notice can be published.
      </p>

      <SubmitButton label="Save notice" pendingLabel="Saving…" />
    </form>
  );
}
