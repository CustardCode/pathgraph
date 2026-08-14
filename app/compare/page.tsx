import type { Metadata } from "next";
import { SiteLink as Link } from "@/components/SiteLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { canonicalCareers, comparisonPath, publishedComparisons, siteUrl } from "@/lib/pathgraph";

export const metadata: Metadata = {
  title: "Compare Careers: Pay, Skills & Work | PathGraph",
  description: "Explore approved career comparisons with local pay, market, entry and work-characteristic trade-offs.",
  alternates: { canonical: siteUrl("/compare") },
};

export default function CompareIndexPage() {
  const comparisons = publishedComparisons();
  return (
    <main>
      <SiteHeader />
      <section className="route-hero index-hero">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare careers" }]} />
        <p className="eyebrow">Approved comparisons</p>
        <h1>Compare paths that answer a real decision.</h1>
        <p className="hero-lede">PathGraph publishes selected comparisons with enough overlapping data and a useful decision-making purpose—not every mathematical permutation.</p>
      </section>
      <section className="route-content">
        <div className="comparison-directory">
          {comparisons.map((item, index) => (
            <Link key={item.slug} href={comparisonPath(canonicalCareers[item.left].id, canonicalCareers[item.right].id)} prefetch={false}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h2>{canonicalCareers[item.left].title} vs {canonicalCareers[item.right].title}</h2><p>{item.reason}</p></div>
              <i>Compare →</i>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
