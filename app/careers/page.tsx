import type { Metadata } from "next";
import { SiteLink as Link } from "@/components/SiteLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { canonicalCareers, careerPath, getMarket, money, publishedCareers, siteUrl } from "@/lib/pathgraph";

export const metadata: Metadata = {
  title: "Career Profiles: Pay, Skills & Outlook | PathGraph",
  description: "Explore twenty detailed career profiles with official local labour-market facts across six countries.",
  alternates: { canonical: siteUrl("/careers") },
};

export default function CareersIndexPage() {
  const careers = publishedCareers();
  return (
    <main>
      <SiteHeader />
      <section className="route-hero index-hero">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Careers" }]} />
        <p className="eyebrow">Career library</p>
        <h1>Explore careers with the facts attached.</h1>
        <p className="hero-lede">Start with one career, switch between six countries and follow approved comparisons into the wider PathGraph network.</p>
      </section>
      <section className="route-content">
        <div className="directory-grid">
          {careers.map((key, index) => {
            const career = canonicalCareers[key];
            const market = getMarket(key, "us");
            return (
              <Link key={key} href={careerPath(career.id)} prefetch={false}>
                <span>{String(index + 1).padStart(2, "0")} · career profile</span>
                <h2>{career.title}</h2>
                <p>{market.annualMedian === null ? "Salary not currently available" : `${money(market.annualMedian, "us")} US median annual earnings`}</p>
                <i>Open profile →</i>
              </Link>
            );
          })}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
