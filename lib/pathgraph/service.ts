import { adapters } from "./adapters";
import { countryRegistry } from "./registry";
import type { CareerKey, CountryId, Fact, MetricKey } from "./model";

export type MarketView = {
  code: string;
  localTitle: string;
  mappingQuality: string;
  annualMedian: number | null;
  headlineLabel: string;
  education: string;
  training: string;
  benchmark: boolean;
  momentum: number;
  momentumAvailable: boolean;
  facts: ReturnType<typeof getRecord>["facts"];
};

export type ComparisonMetricRow = { key: MetricKey; label: string; a: string; b: string; higherWins: boolean };

export const countries = Object.values(countryRegistry)
  .filter((country) => country.enabled)
  .map(({ id, label, shortLabel, aliases }) => ({ id, label, shortLabel, aliases }));

export function getCountry(countryId: CountryId) {
  return countryRegistry[countryId];
}

export function getRecord(careerKey: CareerKey, countryId: CountryId) {
  const adapter = adapters[countryId];
  if (!adapter) throw new Error(`No PathGraph adapter registered for ${countryId}`);
  return adapter.records[careerKey];
}

function numeric(fact: Fact<number | string>) {
  return fact.status === "AVAILABLE" && typeof fact.value === "number" ? fact.value : null;
}

export function getMarket(careerKey: CareerKey, countryId: CountryId): MarketView {
  const record = getRecord(careerKey, countryId);
  const country = getCountry(countryId);
  const annualMedian = numeric(record.facts.annualMedian);
  const momentumFact = country.momentumMetric ? record.facts[country.momentumMetric] : null;
  const rawMomentum = momentumFact ? numeric(momentumFact) : null;
  const momentum = country.momentumMetric === "employmentChange" && rawMomentum !== null
    ? rawMomentum / Math.max(numeric(record.facts.employment) ?? 1, 1) * 100
    : rawMomentum ?? 0;
  return {
    code: record.mappings[0]?.occupationCode ?? "Unmapped",
    localTitle: record.localTitle,
    mappingQuality: record.mappings[0]?.quality ?? "MANUAL_REVIEW",
    annualMedian,
    headlineLabel: record.facts.annualMedian.label.toLowerCase(),
    education: record.education,
    training: record.credential,
    benchmark: record.salaryBasis === "RANGE_MIDPOINT",
    momentum,
    momentumAvailable: rawMomentum !== null,
    facts: record.facts,
  };
}

export function money(value: number, countryId: CountryId, maximumFractionDigits = 0) {
  const country = getCountry(countryId);
  return new Intl.NumberFormat(country.locale, { style: "currency", currency: country.currency, maximumFractionDigits, minimumFractionDigits: maximumFractionDigits }).format(value);
}

export function compact(value: number, countryId: CountryId) {
  return new Intl.NumberFormat(getCountry(countryId).locale, { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function classification(countryId: CountryId) {
  return getCountry(countryId).occupationTaxonomy.label;
}

function unavailableText(fact: Fact<number | string>) {
  if (fact.status === "SUPPRESSED") return "Suppressed";
  if (fact.status === "NOT_APPLICABLE" && fact.note?.includes("province")) return "Varies by province";
  if (fact.status === "STALE") return "Update pending";
  return "Not available";
}

export function formatFact(fact: Fact<number | string>, countryId: CountryId) {
  if (fact.status !== "AVAILABLE" || fact.value === null) return unavailableText(fact);
  if (typeof fact.value === "string") {
    if (fact.value.includes("|") && fact.unit?.endsWith("/year")) {
      const [low, high] = fact.value.split("|").map(Number);
      return `${money(low, countryId)}–${money(high, countryId)}`;
    }
    return fact.value;
  }
  if (fact.unit?.startsWith(`${getCountry(countryId).currency}/`)) return money(fact.value, countryId, fact.unit.endsWith("/hour") ? 2 : 0);
  if (fact.unit === "percent") return `${fact.value}%`;
  if (fact.unit?.startsWith("people")) return `${fact.value > 0 && fact.label.includes("change") ? "+" : ""}${compact(fact.value, countryId)}`;
  return String(fact.value);
}

const displayOrder: MetricKey[] = ["annualMedian", "nativeMedian", "hourlyMedian", "range", "employment", "employmentChange", "projectedGrowth", "earningsChange", "annualOpenings", "education", "credential"];

export function getComparisonRows(left: MarketView, right: MarketView, countryId: CountryId): ComparisonMetricRow[] {
  const country = getCountry(countryId);
  return displayOrder.flatMap((key) => {
    const a = left.facts[key];
    const b = right.facts[key];
    if (key === "nativeMedian" && left.facts.annualMedian.value === a.value && right.facts.annualMedian.value === b.value) return [];
    const visible = a.status === "AVAILABLE" || b.status === "AVAILABLE" || (key === "projectedGrowth" && country.capabilities.outlook.status === "NOT_APPLICABLE");
    if (!visible) return [];
    const lowerIsContext = key === "education" || key === "credential" || key === "range";
    return [{ key, label: a.label || b.label, a: formatFact(a, countryId), b: formatFact(b, countryId), higherWins: !lowerIsContext }];
  });
}

export function getDemandVerdict(left: MarketView, right: MarketView, countryId: CountryId) {
  const country = getCountry(countryId);
  if (!country.momentumMetric || !left.momentumAvailable || !right.momentumAvailable) {
    return { label: country.momentumLabel, winner: null, message: country.capabilities.outlook.status === "NOT_APPLICABLE" ? "Varies by province" : "Not available" };
  }
  return { label: country.momentumLabel, winner: left.momentum >= right.momentum ? "left" as const : "right" as const, message: null };
}

export function validateFoundation() {
  const errors: string[] = [];
  for (const country of Object.values(countryRegistry)) {
    const adapter = adapters[country.id];
    if (!adapter) errors.push(`${country.id}: adapter missing`);
    if (country.enabled) {
      const records = Object.values(adapter.records);
      const annualFacts = records.filter((record) => record.facts.annualMedian.status === "AVAILABLE").length;
      if (records.length < country.minimumCoverage.careers) errors.push(`${country.id}: career coverage below threshold`);
      if (annualFacts < country.minimumCoverage.annualSalaryFacts) errors.push(`${country.id}: annual salary coverage below threshold`);
      if (records.some((record) => record.countryId !== country.id)) errors.push(`${country.id}: adapter contains cross-country facts`);
      if (records.some((record) => record.facts.annualMedian.provenance?.sourceId.startsWith("us-") && country.id !== "us")) errors.push(`${country.id}: silent US salary fallback detected`);
    }
  }
  return errors;
}
