import { canonicalCareers } from "../catalog";
import { available, emptyFacts, unavailable } from "../facts";
import type { CareerKey, CareerMarketRecord, CountryId, MappingQuality, Provenance } from "../model";

export type SeedRecord = {
  key: CareerKey;
  countryId: CountryId;
  taxonomyId: string;
  taxonomyVersion: string;
  code: string;
  localTitle?: string;
  mappingQuality?: MappingQuality;
  sourceId: string;
  salarySourceId?: string;
  salaryReleaseId?: string;
  salaryReferencePeriod?: string;
  releaseId: string;
  referencePeriod: string;
  reviewedAt: string;
  salary: { value: number; unit: "USD/year" | "AUD/week" | "CAD/hour" | "GBP/year" | "NZD/year" | "NZD/hour" | "SGD/month"; basis?: "RANGE_MIDPOINT"; low?: number; high?: number };
  hourly?: number;
  p10?: number;
  p90?: number;
  employment?: number;
  employmentChange?: number;
  earningsChangePercent?: number;
  projectedGrowth?: number;
  annualOpenings?: number;
  education: string;
  credential: string;
  metricSourceIds?: Partial<Record<"employment" | "outlook" | "education", string>>;
};

function provenance(seed: SeedRecord, sourceId = seed.sourceId, quality: Provenance["qualityStatus"] = "OFFICIAL"): Provenance {
  return {
    sourceId,
    sourceReleaseId: seed.releaseId,
    referencePeriod: seed.referencePeriod,
    geographyId: `${seed.countryId.toUpperCase()}-NATIONAL`,
    retrievedAt: seed.reviewedAt,
    qualityStatus: quality,
  };
}

function salaryProvenance(seed: SeedRecord, quality: Provenance["qualityStatus"] = "OFFICIAL"): Provenance {
  return {
    ...provenance(seed, seed.salarySourceId, quality),
    sourceReleaseId: seed.salaryReleaseId ?? seed.releaseId,
    referencePeriod: seed.salaryReferencePeriod ?? seed.referencePeriod,
  };
}

function annualise(seed: SeedRecord) {
  if (seed.salary.unit.endsWith("/week")) return seed.salary.value * 52;
  if (seed.salary.unit.endsWith("/hour")) return seed.salary.value * 40 * 52;
  if (seed.salary.unit.endsWith("/month")) return seed.salary.value * 12;
  return seed.salary.value;
}

function annualUnit(nativeUnit: SeedRecord["salary"]["unit"]) {
  return `${nativeUnit.split("/")[0]}/year`;
}

export function buildRecord(seed: SeedRecord): CareerMarketRecord {
  const canonical = canonicalCareers[seed.key];
  const facts = emptyFacts();
  const nativeUnit = seed.salary.unit;
  const nativeLabel = nativeUnit.endsWith("/week")
    ? "Median full-time weekly earnings"
    : nativeUnit.endsWith("/hour")
      ? "Median hourly wage"
      : nativeUnit.endsWith("/month")
        ? "Median monthly gross wage"
      : seed.salary.basis === "RANGE_MIDPOINT"
        ? "Annual salary-range midpoint"
        : "Median annual earnings";
  const annual = annualise(seed);

  facts.nativeMedian = available(nativeLabel, seed.salary.value, nativeUnit, salaryProvenance(seed));
  facts.annualMedian = available(
    seed.salary.basis === "RANGE_MIDPOINT" ? "Annual salary-range midpoint" : nativeUnit.endsWith("/year") ? "Median annual earnings" : "Annualised median earnings",
    annual,
    annualUnit(nativeUnit),
    salaryProvenance(seed, nativeUnit.endsWith("/year") && !seed.salary.basis ? "OFFICIAL" : seed.salary.basis ? "BENCHMARK" : "DERIVED"),
    nativeUnit.endsWith("/year") && !seed.salary.basis
      ? {}
      : {
          derivation: seed.salary.basis
            ? { method: "midpoint", inputFactKeys: ["range"], assumptions: ["The published lower and upper bounds are treated as symmetric for display."] }
            : nativeUnit.endsWith("/week")
              ? { method: "weekly × 52", inputFactKeys: ["nativeMedian"], assumptions: ["52 paid weeks per year"] }
              : nativeUnit.endsWith("/month")
                ? { method: "monthly × 12", inputFactKeys: ["nativeMedian"], assumptions: ["12 paid months per year"] }
                : { method: "hourly × 40 × 52", inputFactKeys: ["nativeMedian"], assumptions: ["40 paid hours per week", "52 paid weeks per year"] },
        },
  );
  if (seed.hourly !== undefined) facts.hourlyMedian = available("Median hourly earnings", seed.hourly, `${nativeUnit.split("/")[0]}/hour`, provenance(seed));
  if (seed.p10 !== undefined && seed.p90 !== undefined) facts.range = available("Typical range · P10–P90", `${seed.p10}|${seed.p90}`, nativeUnit.replace("/week", "/year").replace("/hour", "/year"), provenance(seed));
  if (seed.salary.low !== undefined && seed.salary.high !== undefined) facts.range = available("Published salary range", `${seed.salary.low}|${seed.salary.high}`, annualUnit(nativeUnit), salaryProvenance(seed, "BENCHMARK"));
  if (seed.employment !== undefined) facts.employment = available("Current employment", seed.employment, "people", provenance(seed, seed.metricSourceIds?.employment));
  if (seed.employmentChange !== undefined) facts.employmentChange = available("Employment change · past year", seed.employmentChange, "people/year", provenance(seed, seed.metricSourceIds?.employment));
  if (seed.earningsChangePercent !== undefined) facts.earningsChange = available("Annual earnings change", seed.earningsChangePercent, "percent", provenance(seed, seed.metricSourceIds?.outlook, "PROVISIONAL"));
  if (seed.projectedGrowth !== undefined) facts.projectedGrowth = available("Projected growth", seed.projectedGrowth, "percent", provenance(seed, seed.metricSourceIds?.outlook));
  if (seed.annualOpenings !== undefined) facts.annualOpenings = available("Annual openings", seed.annualOpenings, "people/year", provenance(seed, seed.metricSourceIds?.outlook));
  facts.education = available("Typical education", seed.education, "text", provenance(seed, seed.metricSourceIds?.education));
  facts.credential = available("Training / credential", seed.credential, "text", provenance(seed, seed.metricSourceIds?.education));

  if (seed.countryId === "ca") {
    facts.projectedGrowth = unavailable("National outlook", "NOT_APPLICABLE", "Canada publishes outlooks by province and economic region; no national value is substituted.");
  }

  return {
    canonicalCareerId: canonical.id,
    countryId: seed.countryId,
    localTitle: seed.localTitle ?? canonical.title,
    titleVariants: [],
    educationNotes: seed.education,
    licensingRequirements: seed.credential,
    mappings: [{
      taxonomyId: seed.taxonomyId,
      taxonomyVersion: seed.taxonomyVersion,
      occupationCode: seed.code,
      localTitle: seed.localTitle ?? canonical.title,
      quality: seed.mappingQuality ?? "EXACT",
      method: "LEGACY_SEED",
      confidence: seed.mappingQuality && seed.mappingQuality !== "EXACT" ? "MEDIUM" : "HIGH",
      sourceId: seed.sourceId,
      reviewedAt: seed.reviewedAt,
      notes: "Curated against the declared national taxonomy and reviewed for the current PathGraph coverage.",
    }],
    facts,
    salaryBasis: seed.salary.basis ?? (nativeUnit.endsWith("/week") ? "WEEKLY_ANNUALISED" : nativeUnit.endsWith("/hour") ? "HOURLY_ANNUALISED" : nativeUnit.endsWith("/month") ? "MONTHLY_ANNUALISED" : "ANNUAL"),
    education: seed.education,
    credential: seed.credential,
    availability: "AVAILABLE",
    lastReviewedAt: seed.reviewedAt,
  };
}
