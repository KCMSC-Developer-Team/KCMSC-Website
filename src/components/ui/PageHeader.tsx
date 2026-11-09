import { SubpageHero } from "@/components/subpage/SubpageKit";

export function PageHeader({ heading, intro }: { heading: string; intro?: string }) {
  return <SubpageHero compact kicker="KCMSC" title={heading} body={intro} />;
}
