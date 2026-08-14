"use client";

import { SiteLink as Link } from "@/components/SiteLink";
import { useState, useSyncExternalStore } from "react";
import { careers, signalLabels, type CareerId } from "@/app/page";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { trackEvent } from "@/components/Analytics";
import {
  canonicalCareers,
  careerPath,
  comparisonPath,
  comparisonsForCareer,
  countries,
  formatFact,
  getCountry,
  getMarket,
  publishedCareers,
  sourceRegistry,
  type CountryId,
} from "@/lib/pathgraph";

export function CareerPageClient({ careerKey, initialCountry }: { careerKey: CareerId; initialCountry: CountryId }) {
  const [countryOverride, setCountry] = useState<CountryId | null>(null);
  const locationSearch = useSyncExternalStore(
    () => () => undefined,
    () => window.location.search,
    () => "",
  );
  const requestedCountry = new URLSearchParams(locationSearch).get("country") as CountryId | null;
  const country = countryOverride ?? (requestedCountry && countries.some((item) => item.id === requestedCountry) ? requestedCountry : initialCountry);
  const career = careers[careerKey];
  const canonicalCareer = canonicalCareers[careerKey];
  const market = getMarket(careerKey, country);
  const countryData = getCountry(country);
  const comparisons = comparisonsForCareer(careerKey, 6);
  const nearbyCareers = publishedCareers()
    .filter((key) => key !== careerKey)
    .sort((a, b) => Number(careers[b].group === career.group) - Number(careers[a].group === career.group))
    .slice(0, 4);
  const factKeys = ["annualMedian", "nativeMedian", "hourlyMedian", "employment", "employmentChange", "projectedGrowth", "earningsChange", "annualOpenings", "education", "credential"] as const;
  const visibleFacts = factKeys
    .map((key) => ({ key, fact: market.facts[key] }))
    .filter(({ key, fact }) => key === "annualMedian" || fact.status === "AVAILABLE" || fact.status === "STALE" || fact.status === "SUPPRESSED" || fact.status === "NOT_APPLICABLE");
  const sources = Array.from(new Map(
    Object.values(market.facts)
      .flatMap((fact) => fact.provenance ? [[fact.provenance.sourceId, fact.provenance] as const] : [])
  ).entries());
  const mappingCopy = market.mappingQuality === "NO_EQUIVALENT"
    ? "No direct national equivalent; closest regulated comparator shown"
    : ["BROAD", "BROADER"].includes(market.mappingQuality)
      ? "Broader local occupation mapping"
      : ["APPROXIMATE", "PARTIAL", "REVIEW_REQUIRED", "MANUAL_REVIEW"].includes(market.mappingQuality)
        ? "Approximate local occupation mapping"
        : "Local occupation match";

  function changeCountry(nextCountry: CountryId) {
    trackEvent("country_change", {
      previous_country: country,
      selected_country: nextCountry,
      page_type: "career",
      career: careerKey,
    });
    setCountry(nextCountry);
    const params = new URLSearchParams(window.location.search);
    params.set("country", nextCountry);
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }

  return (
    <main>
      <SiteHeader />
      <section className="route-hero" style={{ "--career-accent": career.accent } as React.CSSProperties}>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Careers", href: "/careers" }, { label: canonicalCareer.title }]} />
        <div className="route-hero-grid">
          <div>
            <p className="eyebrow">{career.group} career profile</p>
            <h1>{canonicalCareer.title}</h1>
            <p className="hero-lede">{career.summary} Compare official local market facts with clearly labelled work-signal context.</p>
          </div>
          <label className="country-search route-country-select">
            <span>Country data</span>
            <select value={country} onChange={(event) => changeCountry(event.target.value as CountryId)} aria-label="Choose country data">
              {countries.map((item) => <option key={item.id} value={item.id}>{item.shortLabel}</option>)}
            </select>
            <i aria-hidden="true">⌄</i>
          </label>
        </div>
        <div className="local-mapping-card">
          <span>{countryData.occupationTaxonomy.label} {market.code}</span>
          <strong>{market.localTitle}</strong>
          <small>{mappingCopy}</small>
        </div>
      </section>

      <section className="route-content">
        <div className="route-section-heading">
          <p className="section-kicker">{countryData.label} facts</p>
          <h2>Pay, market and entry</h2>
          <p>{countryData.sourceNote}</p>
        </div>
        <div className="career-fact-grid">
          {visibleFacts.map(({ key, fact }) => (
            <article key={key}>
              <span>{fact.label}</span>
              <strong>{formatFact(fact, country)}</strong>
              <small>{fact.provenance?.referencePeriod ?? fact.note ?? "Current declared coverage"}</small>
            </article>
          ))}
        </div>
        <p className="route-disclosure">Missing, suppressed and stale facts are never replaced with another country’s values. Annualised figures and benchmarks are identified in their labels and source notes.</p>
      </section>

      <section className="route-content route-dark-section">
        <div className="route-section-heading">
          <p className="section-kicker">Work characteristics</p>
          <h2>What the work may involve</h2>
          <p>Occupation percentiles, not ratings. {countryData.workSignalNote}</p>
        </div>
        <div className="career-signal-grid">
          {(Object.keys(signalLabels) as (keyof typeof signalLabels)[]).map((key) => (
            <article key={key}>
              <div><strong>{signalLabels[key].label}</strong><span>{career.signals[key].toFixed(0)}</span></div>
              <i><b style={{ width: `${career.signals[key]}%`, background: career.accent }} /></i>
              <small>{signalLabels[key].note}</small>
            </article>
          ))}
        </div>
        <div className="skills-card">
          <p className="section-kicker">Useful foundations</p>
          <ul>{career.strengths.map((strength) => <li key={strength}>{strength}</li>)}</ul>
        </div>
      </section>

      <section className="route-content">
        <div className="route-section-heading"><p className="section-kicker">Compare this career</p><h2>Meaningful adjacent choices</h2></div>
        <div className="related-grid">
          {comparisons.map((item) => {
            const other = item.left === careerKey ? item.right : item.left;
            return (
              <Link key={item.slug} href={`${comparisonPath(canonicalCareers[item.left].id, canonicalCareers[item.right].id)}?country=${country}`} prefetch={false} onClick={() => trackEvent("career_navigation", { page_type: "career", career: careerKey, destination: item.slug })}>
                <span>{item.reason}</span>
                <strong>{career.shortTitle} vs {careers[other].shortTitle}</strong>
                <i>Compare paths →</i>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="route-content route-split-section">
        <div>
          <p className="section-kicker">Explore another career</p>
          <div className="compact-link-list">
            {nearbyCareers.map((key) => <Link key={key} href={`${careerPath(canonicalCareers[key].id)}?country=${country}`} prefetch={false}>{careers[key].shortTitle}<span>→</span></Link>)}
          </div>
        </div>
        <div>
          <p className="section-kicker">Other countries</p>
          <div className="country-link-list">
            {countries.map((item) => <button key={item.id} type="button" className={item.id === country ? "active" : ""} onClick={() => changeCountry(item.id)}>{item.shortLabel}</button>)}
          </div>
        </div>
      </section>

      <section className="route-content source-summary">
        <div className="route-section-heading"><p className="section-kicker">Sources and dates</p><h2>What this profile uses</h2></div>
        <ul>
          {sources.map(([sourceId, provenance]) => {
            const source = sourceRegistry[sourceId as keyof typeof sourceRegistry];
            return <li key={sourceId}><a href={source?.url} rel="noreferrer" target="_blank"><strong>{source?.publisher ?? sourceId}</strong><span>{source?.dataset} · {provenance.referencePeriod}</span></a></li>;
          })}
        </ul>
        <p>See the complete <Link href="/data-sources" prefetch={false}>data-source register</Link> and <Link href="/methodology" prefetch={false}>PathGraph methodology</Link>.</p>
      </section>
      <SiteFooter marketLabel={countryData.label} source={countryData.footerSource} />
    </main>
  );
}
