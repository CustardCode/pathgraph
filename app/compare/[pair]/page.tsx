import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PathGraphExperience } from "@/app/page";
import {
  canonicalCareers,
  comparisonFromSlug,
  comparisonPath,
  isComparisonIndexable,
  normaliseCountry,
  publishedComparisons,
  siteUrl,
} from "@/lib/pathgraph";

type ComparisonPageProps = {
  params: Promise<{ pair: string }>;
  searchParams: Promise<{ country?: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedComparisons().map((item) => ({ pair: item.slug }));
}

export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
  const { pair } = await params;
  const parsed = comparisonFromSlug(pair);
  if (!parsed || !isComparisonIndexable(parsed.comparison)) return { robots: { index: false, follow: false } };
  const left = canonicalCareers[parsed.comparison.left].title;
  const right = canonicalCareers[parsed.comparison.right].title;
  const canonical = siteUrl(comparisonPath(canonicalCareers[parsed.comparison.left].id, canonicalCareers[parsed.comparison.right].id));
  return {
    title: `${left} vs ${right}: Pay, Skills & Work | PathGraph`,
    description: `Compare ${left} and ${right} across pay, labour-market signals, education and work characteristics in six supported countries.`,
    alternates: { canonical },
    openGraph: {
      title: `${left} vs ${right} | PathGraph`,
      description: `See the real trade-offs between ${left} and ${right}.`,
      url: canonical,
      type: "article",
    },
  };
}

export default async function ComparisonPage({ params, searchParams }: ComparisonPageProps) {
  const [{ pair }, query] = await Promise.all([params, searchParams]);
  const parsed = comparisonFromSlug(pair);
  if (!parsed || !isComparisonIndexable(parsed.comparison)) notFound();
  const country = normaliseCountry(query.country);
  if (parsed.reversed) {
    const suffix = query.country ? `?country=${country}` : "";
    redirect(`/compare/${parsed.comparison.slug}${suffix}`);
  }
  return (
    <PathGraphExperience
      key={parsed.comparison.slug}
      initialLeftId={parsed.comparison.left}
      initialRightId={parsed.comparison.right}
      initialCountry={country}
      pageMode="comparison"
    />
  );
}
