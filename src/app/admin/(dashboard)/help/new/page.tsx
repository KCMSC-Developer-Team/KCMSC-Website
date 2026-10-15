import { HelpArticleForm } from "../HelpArticleForm";
import { createHelpArticleAction } from "../actions";

export default function NewHelpArticlePage() {
  return <div><h1 className="font-heading text-2xl text-ink">New Help Article</h1><p className="mt-1 text-sm text-ink-muted">Write the answer in both languages, then publish when verified.</p><div className="mt-6"><HelpArticleForm action={createHelpArticleAction} /></div></div>;
}
