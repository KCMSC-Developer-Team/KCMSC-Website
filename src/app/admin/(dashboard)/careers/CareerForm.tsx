"use client";

import { useRef, useState } from "react";
import { SubmitButton } from "@/components/admin/SubmitButton";

type CareerDefaults = {
  titleEn?: string;
  titleBn?: string;
  descriptionEn?: string;
  descriptionBn?: string;
  summaryEn?: string | null;
  summaryBn?: string | null;
  categoryEn?: string | null;
  categoryBn?: string | null;
  imageData?: string | null;
  deadline?: Date | null;
  isPublished?: boolean;
};

function toDateInputValue(date?: Date | null) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

function RichTextEditor({
  name,
  label,
  value,
  hint,
}: {
  name: string;
  label: string;
  value?: string;
  hint: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(value || "");

  function format(command: string) {
    editorRef.current?.focus();
    document.execCommand(command, false);
    setHtml(editorRef.current?.innerHTML || "");
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-ink">{label}</label>
      <div className="mt-2 overflow-hidden rounded-xl border border-border bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-[#f8f7f2] p-2">
          {[
            { command: "bold", label: "B", title: "Bold", style: "font-bold" },
            { command: "italic", label: "I", title: "Italic", style: "italic" },
            { command: "underline", label: "U", title: "Underline", style: "underline" },
            { command: "insertUnorderedList", label: "• List", title: "Bullet list", style: "" },
            { command: "insertOrderedList", label: "1. List", title: "Numbered list", style: "" },
            { command: "formatBlock", value: "h3", label: "H", title: "Heading", style: "font-semibold" },
            { command: "formatBlock", value: "blockquote", label: "❝", title: "Quote", style: "" },
          ].map((tool) => (
            <button
              key={tool.title}
              type="button"
              title={tool.title}
              aria-label={tool.title}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                if (tool.command === "formatBlock") {
                  editorRef.current?.focus();
                  document.execCommand(tool.command, false, tool.value);
                  setHtml(editorRef.current?.innerHTML || "");
                } else format(tool.command);
              }}
              className={`min-h-9 min-w-9 rounded-md border border-transparent px-3 text-sm text-ink hover:border-border hover:bg-white ${tool.style}`}
            >
              {tool.label}
            </button>
          ))}
          <span className="ml-auto px-2 text-[10px] text-ink-muted">Rich text</span>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label={label}
          onInput={(event) => setHtml(event.currentTarget.innerHTML)}
          onBlur={(event) => setHtml(event.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: value || "" }}
          className="min-h-44 whitespace-normal px-4 py-3 text-sm leading-7 text-ink outline-none [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:font-semibold [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6"
        />
      </div>
      <input type="hidden" name={name} value={html} />
      <p className="mt-1.5 text-xs leading-5 text-ink-muted">{hint}</p>
    </div>
  );
}

async function prepareImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Image must be smaller than 8 MB.");
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = objectUrl;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("This image could not be opened."));
    });
    const maxSide = 1800;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image processing is not available in this browser.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/webp", 0.76);
    if (data.length > 1_000_000) throw new Error("The compressed image is still too large. Please choose a smaller image (under about 750 KB after compression).");
    return data;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function CareerForm({
  action,
  defaults = {},
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaults?: CareerDefaults;
}) {
  const [imageData, setImageData] = useState(defaults.imageData || "");
  const [imageError, setImageError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function chooseImage(file?: File) {
    if (!file) return;
    setImageError("");
    try {
      setImageData(await prepareImage(file));
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Could not process this image.");
    }
  }

  return (
    <form action={action} className="max-w-5xl space-y-8">
      <section className="rounded-2xl border border-border bg-white p-5 sm:p-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">01 · Vacancy identity</p>
        <h2 className="mt-2 font-heading text-xl text-ink">What visitors see first</h2>
        <p className="mt-1 text-sm leading-6 text-ink-muted">Set the title, category and short card description independently from the full job details.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="titleEn" className="block text-sm font-medium text-ink">Job title (English) *</label>
            <input id="titleEn" name="titleEn" required defaultValue={defaults.titleEn} className="mt-2 w-full rounded-lg border border-border px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
          </div>
          <div>
            <label htmlFor="titleBn" className="block text-sm font-medium text-ink">Job title (বাংলা) *</label>
            <input id="titleBn" name="titleBn" required defaultValue={defaults.titleBn} className="mt-2 w-full rounded-lg border border-border px-3.5 py-3 text-sm font-bangla outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
          </div>
          <div>
            <label htmlFor="categoryEn" className="block text-sm font-medium text-ink">Card category (English)</label>
            <input id="categoryEn" name="categoryEn" placeholder="e.g. Science & Laboratory" defaultValue={defaults.categoryEn || ""} className="mt-2 w-full rounded-lg border border-border px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
          </div>
          <div>
            <label htmlFor="categoryBn" className="block text-sm font-medium text-ink">Card category (বাংলা)</label>
            <input id="categoryBn" name="categoryBn" placeholder="যেমন: বিজ্ঞান ও গবেষণাগার" defaultValue={defaults.categoryBn || ""} className="mt-2 w-full rounded-lg border border-border px-3.5 py-3 text-sm font-bangla outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="summaryEn" className="block text-sm font-medium text-ink">Short description for the vacancy card (English) *</label>
            <textarea id="summaryEn" name="summaryEn" required rows={3} maxLength={500} defaultValue={defaults.summaryEn || ""} placeholder="A concise summary, shown on the card before someone opens the role." className="mt-2 w-full rounded-lg border border-border px-3.5 py-3 text-sm leading-6 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="summaryBn" className="block text-sm font-medium text-ink">Short description for the vacancy card (বাংলা) *</label>
            <textarea id="summaryBn" name="summaryBn" required rows={3} maxLength={500} defaultValue={defaults.summaryBn || ""} placeholder="কার্ডে দেখানোর জন্য সংক্ষিপ্ত বিবরণ লিখুন।" className="mt-2 w-full rounded-lg border border-border px-3.5 py-3 text-sm font-bangla leading-6 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 sm:p-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">02 · Vacancy thumbnail</p>
        <h2 className="mt-2 font-heading text-xl text-ink">Choose the card image</h2>
        <p className="mt-1 text-sm leading-6 text-ink-muted">Drag a photo here or browse your computer. The image is resized before saving.</p>
        <input type="hidden" name="imageData" value={imageData} />
        <div
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); void chooseImage(event.dataTransfer.files?.[0]); }}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); fileRef.current?.click(); } }}
          role="button"
          tabIndex={0}
          aria-label="Upload a vacancy thumbnail by dragging an image here or selecting a file"
          className={`mt-5 flex min-h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${dragging ? "border-primary bg-[#edf8f1]" : "border-[#d8d8ce] bg-[#f8f7f2] hover:border-primary/60"}`}
        >
          {imageData ? (
            <div className="relative w-full">
              <img src={imageData} alt="Vacancy thumbnail preview" className="h-64 w-full object-cover" />
              <span className="absolute bottom-3 left-3 rounded-full bg-black/65 px-3 py-1.5 text-xs text-white">Click or drop to replace image</span>
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d8d8ce] bg-white text-2xl text-primary">＋</span>
              <p className="mt-4 text-sm font-semibold text-ink">Drop an image here</p>
              <p className="mt-1 text-xs text-ink-muted">or click to browse · JPG, PNG, WebP · up to 8 MB</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(event) => void chooseImage(event.target.files?.[0])} />
        {imageError ? <p role="alert" className="mt-3 text-sm text-brick">{imageError}</p> : null}
        {imageData ? <button type="button" onClick={() => { setImageData(""); if (fileRef.current) fileRef.current.value = ""; }} className="mt-3 text-sm font-medium text-brick hover:underline">Remove thumbnail</button> : null}
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 sm:p-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">03 · Full role details</p>
        <h2 className="mt-2 font-heading text-xl text-ink">What opens when someone clicks the card</h2>
        <p className="mt-1 text-sm leading-6 text-ink-muted">Use the formatting toolbar for bold, italics, headings and lists. This content appears in the details overlay.</p>
        <div className="mt-6 space-y-6">
          <RichTextEditor name="descriptionEn" label="Full description (English) *" value={defaults.descriptionEn} hint="Include responsibilities, qualifications, working arrangements and any other details applicants need." />
          <RichTextEditor name="descriptionBn" label="Full description (বাংলা) *" value={defaults.descriptionBn} hint="বাংলায় দায়িত্ব, যোগ্যতা ও প্রয়োজনীয় তথ্য লিখুন।" />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 sm:p-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">04 · Publication</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 sm:items-end">
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-ink">Application deadline · optional</label>
            <input id="deadline" name="deadline" type="date" defaultValue={toDateInputValue(defaults.deadline)} className="mt-2 w-full rounded-lg border border-border px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
            <p className="mt-1 text-xs text-ink-muted">Leave blank for “Until further notice”.</p>
          </div>
          <label className="flex min-h-12 items-center gap-3 rounded-lg border border-border bg-[#f8f7f2] px-4 py-3 text-sm font-medium text-ink">
            <input type="checkbox" name="isPublished" defaultChecked={defaults.isPublished} className="h-4 w-4 accent-[#176b45]" />
            Publish this vacancy on the public website
          </label>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-xs leading-5 text-ink-muted">Drafts stay in the admin panel. Only published vacancies appear on the public Careers page.</p>
        <SubmitButton label="Save vacancy" pendingLabel="Saving vacancy…" />
      </div>
    </form>
  );
}
