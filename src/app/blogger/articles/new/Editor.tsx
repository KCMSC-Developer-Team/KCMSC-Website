"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function ToolButton({
  active = false,
  disabled = false,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm transition ${
        active
          ? "border-[#176b45] bg-[#e7f2e9] text-[#176b45]"
          : "border-transparent bg-white text-[#303630] hover:border-[#d8ddd4] hover:bg-[#f7f8f5]"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export default function Editor() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const params = useSearchParams();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-[#176b45] underline underline-offset-2",
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
    ],
    content: "<p></p>",
    editorProps: {
      attributes: {
        class:
          "tiptap-editor min-h-[420px] px-7 py-6 text-[16px] leading-8 text-[#242824] outline-none",
        "aria-label": "Article content",
      },
    },
  });

  function addLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const input = window.prompt("Enter a URL (https://…)", previous || "https://");
    if (input === null) return;
    if (!input.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    try {
      const url = new URL(input.trim());
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        setMessage("Please use an HTTP or HTTPS link.");
        return;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: url.href }).run();
      setMessage("");
    } catch {
      setMessage("Enter a valid URL, including https://.");
    }
  }

  async function pasteImage(e: React.ClipboardEvent<HTMLDivElement>) {
    const item = Array.from(e.clipboardData.items).find((x) => x.type.startsWith("image/"));
    if (!item) return;
    e.preventDefault();
    const file = item.getAsFile();
    if (!file || !editor) return;
    if (file.size > 1024 * 1024) {
      setMessage("Please paste an image smaller than 1 MB.");
      return;
    }
    setMessage("Image paste is not enabled in this editor yet. Text formatting and lists are supported.");
  }

  async function save(publish: boolean) {
    if (busy || title.trim().length < 3 || !editor) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/blog/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: editor.getHTML(),
          publish,
          id: params.get("edit") || undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save article.");
      setMessage(publish ? "Article published." : "Draft saved.");
      router.refresh();
      if (!params.get("edit")) router.push("/blogger/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save article.");
    } finally {
      setBusy(false);
    }
  }

  if (!editor) return <div className="mt-7 rounded-xl border bg-white p-6">Loading editor…</div>;

  const heading = (level: 2 | 3) =>
    editor.isActive("heading", { level });

  return (
    <div className="mt-7 space-y-5">
      <section className="overflow-hidden rounded-xl border border-[#d9d8cf] bg-white shadow-sm">
        <div className="border-b border-[#e7e6df] bg-[#fafaf8] px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#687168]">Article details</p>
        </div>
        <div className="space-y-4 p-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add title"
            aria-label="Article title"
            maxLength={180}
            className="w-full border-0 border-b border-[#e5e7df] bg-transparent px-0 py-3 font-serif text-3xl leading-tight text-[#242824] outline-none placeholder:text-[#a2a79f] focus:border-[#176b45] focus:ring-0"
          />
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            maxLength={600}
            rows={2}
            placeholder="Write an excerpt (optional). This may appear on article cards and search previews."
            aria-label="Article excerpt"
            className="w-full resize-y rounded-lg border border-[#e1e3dc] bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-[#176b45] focus:ring-2 focus:ring-[#176b45]/10"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#d9d8cf] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e7df] bg-[#fafaf8] px-4 py-2">
          <div>
            <p className="text-sm font-semibold text-[#242824]">Content</p>
            <p className="text-xs text-[#737b72]">Select text or place the cursor, then choose a format.</p>
          </div>
          <span className="rounded-full bg-[#e7f2e9] px-2.5 py-1 text-xs font-medium text-[#176b45]">Visual editor</span>
        </div>

        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-[#e5e7df] bg-white/95 p-2 backdrop-blur">
          <ToolButton label="Paragraph" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>¶</ToolButton>
          <span className="mx-1 h-6 w-px bg-[#e1e3dc]" />
          <ToolButton label="Heading 2" active={heading(2)} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><strong>H2</strong></ToolButton>
          <ToolButton label="Heading 3" active={heading(3)} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><strong>H3</strong></ToolButton>
          <span className="mx-1 h-6 w-px bg-[#e1e3dc]" />
          <ToolButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></ToolButton>
          <ToolButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></ToolButton>
          <ToolButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><span className="underline">U</span></ToolButton>
          <ToolButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></ToolButton>
          <span className="mx-1 h-6 w-px bg-[#e1e3dc]" />
          <ToolButton label="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</ToolButton>
          <ToolButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</ToolButton>
          <ToolButton label="Block quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝ Quote</ToolButton>
          <span className="mx-1 h-6 w-px bg-[#e1e3dc]" />
          <ToolButton label="Add or edit link" active={editor.isActive("link")} onClick={addLink}>↗ Link</ToolButton>
          <ToolButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>↶</ToolButton>
          <ToolButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>↷</ToolButton>
        </div>

        <div onPaste={pasteImage}>
          <EditorContent editor={editor} />
        </div>
        <div className="border-t border-[#e5e7df] bg-[#fafaf8] px-4 py-3 text-xs leading-5 text-[#737b72]">
          Formatting is saved as HTML. Use headings to structure sections, lists for steps, and links for sources.
        </div>
      </section>

      {message && <p role="status" className="rounded-lg border border-[#d7e8d7] bg-[#edf5ec] p-3 text-sm text-[#176b45]">{message}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-[#737b72]">Tip: preview the article after saving to confirm the public layout.</p>
        <div className="flex gap-3">
          <button type="button" disabled={busy || title.trim().length < 3} onClick={() => save(false)} className="rounded-lg border border-[#cfd5ca] bg-white px-5 py-3 text-sm font-semibold text-[#303630] hover:bg-[#f7f8f5] disabled:opacity-50">{busy ? "Saving…" : "Save draft"}</button>
          <button type="button" disabled={busy || title.trim().length < 3} onClick={() => save(true)} className="rounded-lg bg-[#176b45] px-5 py-3 text-sm font-semibold text-white hover:bg-[#124c36] disabled:opacity-50">{busy ? "Saving…" : "Publish article"}</button>
        </div>
      </div>

      <style jsx global>{`
        .tiptap-editor:focus { outline: none; }
        .tiptap-editor p { margin: 0.75rem 0; }
        .tiptap-editor h2 { margin: 2rem 0 0.75rem; font-family: Georgia, serif; font-size: 1.75rem; line-height: 1.3; font-weight: 700; }
        .tiptap-editor h3 { margin: 1.5rem 0 0.5rem; font-family: Georgia, serif; font-size: 1.35rem; line-height: 1.4; font-weight: 700; }
        .tiptap-editor ul { list-style: disc; padding-left: 1.5rem; margin: 1rem 0; }
        .tiptap-editor ol { list-style: decimal; padding-left: 1.5rem; margin: 1rem 0; }
        .tiptap-editor li { margin: 0.25rem 0; }
        .tiptap-editor blockquote { margin: 1.25rem 0; border-left: 4px solid #176b45; padding: 0.25rem 0 0.25rem 1rem; color: #59645b; }
        .tiptap-editor a { color: #176b45; text-decoration: underline; text-underline-offset: 2px; }
        .tiptap-editor p.is-editor-empty:first-child::before { color: #a2a79f; content: 'Start writing your article…'; float: left; height: 0; pointer-events: none; }
        .tiptap-editor img { max-width: 100%; height: auto; border-radius: 0.5rem; }
      `}</style>
    </div>
  );
}
