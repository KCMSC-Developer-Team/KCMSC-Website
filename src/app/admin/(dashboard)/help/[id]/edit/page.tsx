import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { HelpArticleForm } from "../../HelpArticleForm";
import { updateHelpArticleAction } from "../../actions";

export default async function EditHelpArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.helpArticle.findUnique({ where: { id: params.id } });
  if (!article) notFound();
  return <div><h1 className="font-heading text-2xl text-ink">Edit Help Article</h1><p className="mt-1 text-sm text-ink-muted">Changes are reflected on the public Help Center after saving.</p><div className="mt-6"><HelpArticleForm action={updateHelpArticleAction.bind(null, article.id)} defaults={article} /></div></div>;
}
