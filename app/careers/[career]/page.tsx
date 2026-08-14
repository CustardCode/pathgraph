import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CareerPageClient } from "./CareerPageClient";
import {
  canonicalCareers,
  careerKeyFromSlug,
  careerPath,
  isCareerIndexable,
  normaliseCountry,
  publishedCareers,
  siteUrl,
} from "@/lib/pathgraph";

type CareerPageProps = {
  params: Promise<{ career: string }>;
  searchParams: Promise<{ country?: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedCareers().map((career) => ({ career: canonicalCareers[career].id }));
}

export async function generateMetadata({ params }: CareerPageProps): Promise<Metadata> {
  const { career: slug } = await params;
  const career = careerKeyFromSlug(slug);
  if (!career || !isCareerIndexable(career)) return { robots: { index: false, follow: false } };
  const title = canonicalCareers[career].title;
  const canonical = siteUrl(careerPath(slug));
  return {
    title: `${title} Salary, Skills & Career Outlook | PathGraph`,
    description: `Explore ${title} pay, local labour-market facts, entry requirements and work characteristics across the USA, Australia, Canada, UK, New Zealand and Singapore.`,
    alternates: { canonical },
    openGraph: {
      title: `${title}: Pay, Skills & Career Outlook | PathGraph`,
      description: `Official local career facts and clearly labelled work signals for ${title}.`,
      url: canonical,
      type: "article",
    },
  };
}

export default async function CareerPage({ params, searchParams }: CareerPageProps) {
  const [{ career: slug }, query] = await Promise.all([params, searchParams]);
  const career = careerKeyFromSlug(slug);
  if (!career || !isCareerIndexable(career)) notFound();
  return <CareerPageClient careerKey={career} initialCountry={normaliseCountry(query.country)} />;
}
