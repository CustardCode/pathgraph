import type { Metadata } from "next";
import { SiteLink as Link } from "@/components/SiteLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteUrl } from "@/lib/pathgraph";

export const metadata: Metadata = {
  title: "How PathGraph Compares Careers | Methodology",
  description: "Understand PathGraph official inputs, derived annual figures, experimental similarity scores and page-quality rules.",
  alternates: { canonical: siteUrl("/methodology") },
};

export default function MethodologyPage() {
  return (
    <main>
      <SiteHeader />
      <section className="route-hero trust-hero">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Methodology" }]} />
        <p className="eyebrow">Facts first</p>
        <h1>Calculations explained. Limits left visible.</h1>
        <p className="hero-lede">PathGraph separates official labour-market evidence from derived values, descriptive proxies and experimental comparison tools.</p>
      </section>
      <section className="route-content methodology-steps">
        <article><span>01</span><div><h2>Canonical career, local occupation</h2><p>Each PathGraph career has one stable identity. Country adapters map it to the relevant local occupation code and title, retaining mapping quality and review notes.</p></div></article>
        <article><span>02</span><div><h2>Official country inputs</h2><p>Salary, employment, outlook, education and credential facts come from the declared country adapter. Missing, suppressed, stale and not-applicable states remain explicit.</p></div></article>
        <article><span>03</span><div><h2>Comparable presentation</h2><p>Native weekly or hourly pay remains visible where available. Derived annual figures make the main comparison easier, with the calculation stated in the source note.</p></div></article>
        <article><span>04</span><div><h2>Experimental tools</h2><p>Similarity and priority fit are PathGraph exploration tools. Similarity currently uses seeded O*NET-derived domains; priority fit also contains transparent editorial entry and scheduling bands. Neither is an official statistic or recommendation.</p></div></article>
        <article><span>05</span><div><h2>Publishing gates</h2><p>Career pages require useful real data in at least two supported markets. Comparison pages must be approved, have sufficient overlapping metrics, useful internal links and a distinct decision purpose.</p></div></article>
      </section>
      <section className="route-content route-disclosure-panel"><h2>What PathGraph does not do</h2><p>It does not predict individual outcomes, replace licensing advice, rate a career as universally good or bad, or silently borrow a statistic from another country.</p><p>Review the <Link href="/data-sources" prefetch={false}>current source and coverage register</Link>.</p></section>
      <SiteFooter />
    </main>
  );
}
