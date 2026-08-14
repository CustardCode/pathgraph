import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { countryRegistry, licenceRegistry, sourceRegistry, siteUrl } from "@/lib/pathgraph";

export const metadata: Metadata = {
  title: "Career Data Sources & Coverage | PathGraph",
  description: "See the official sources, dates, licences, derived figures and country-specific coverage behind PathGraph.",
  alternates: { canonical: siteUrl("/data-sources") },
};

export default function DataSourcesPage() {
  const enabledCountries = Object.values(countryRegistry).filter((country) => country.enabled);
  return (
    <main>
      <SiteHeader />
      <section className="route-hero trust-hero">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Data sources" }]} />
        <p className="eyebrow">Trust and provenance</p>
        <h1>Career facts should show where they came from.</h1>
        <p className="hero-lede">PathGraph keeps country-specific labour-market facts separate, records source releases per fact and never fills a gap with another country’s statistic.</p>
      </section>
      <section className="route-content trust-page">
        <div className="route-section-heading"><p className="section-kicker">Country coverage</p><h2>Six markets, different evidence</h2></div>
        <div className="country-source-grid">
          {enabledCountries.map((country) => (
            <article key={country.id}>
              <span>{country.shortLabel}</span>
              <h2>{country.label}</h2>
              <p>{country.sourceNote}</p>
              <dl>
                {Object.entries(country.capabilities).map(([name, capability]) => <div key={name}><dt>{name}</dt><dd>{capability.status.replaceAll("_", " ")} · {capability.level.toLowerCase()}</dd></div>)}
              </dl>
            </article>
          ))}
        </div>
      </section>
      <section className="route-content source-register">
        <div className="route-section-heading"><p className="section-kicker">Official register</p><h2>Datasets used in published pages</h2></div>
        <div className="source-table" role="table" aria-label="PathGraph source register">
          {Object.entries(sourceRegistry).map(([id, source]) => {
            const licence = licenceRegistry[source.licenceId as keyof typeof licenceRegistry];
            return <div className="source-row" key={id} role="row"><div role="cell"><strong>{source.publisher}</strong><span>{source.dataset}</span></div><div role="cell">{source.updateCadence.replaceAll("_", " ")}</div><div role="cell">{licence.name}</div><a href={source.url} target="_blank" rel="noreferrer">Official source ↗</a></div>;
          })}
        </div>
      </section>
      <section className="route-content route-disclosure-panel">
        <h2>Derived and proxy values</h2>
        <p>Australian annual figures are weekly medians multiplied by 52. Canadian annual figures are hourly medians multiplied by 40 hours and 52 weeks. Singapore annual figures are monthly gross medians multiplied by 12. New Zealand and selected UK headline figures are transparent midpoints of official published ranges.</p>
        <p>Outside the United States, O*NET work signals are descriptive occupation-level proxies. They are labelled as proxies and are never presented as nationally measured salary, employment or outlook data.</p>
        <p>Automated Tahatū refreshes require an approved Occupations API agreement. SkillsFuture is currently used only for concise pathway context; bulk reuse should receive a separate permission review.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
