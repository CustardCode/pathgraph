export type CareerKey =
  | "rn"
  | "software"
  | "electrician"
  | "accountant"
  | "dental"
  | "sonographer"
  | "plumber"
  | "designer"
  | "security"
  | "teacher"
  | "enrolledNurse"
  | "radiologicTech"
  | "occupationalTherapist"
  | "physiotherapist"
  | "hvac"
  | "welder"
  | "carpenter"
  | "automotiveTech"
  | "financialAnalyst"
  | "systemsAnalyst";

export type CanonicalCareerId =
  | "registered-nurse"
  | "software-developer"
  | "electrician"
  | "accountant"
  | "dental-hygienist"
  | "diagnostic-medical-sonographer"
  | "plumber"
  | "graphic-designer"
  | "information-security-analyst"
  | "secondary-school-teacher"
  | "enrolled-nurse"
  | "radiologic-technologist"
  | "occupational-therapist"
  | "physiotherapist"
  | "hvac-technician"
  | "welder"
  | "carpenter"
  | "automotive-technician"
  | "financial-analyst"
  | "systems-analyst";

export type CountryId = "us" | "au" | "ca" | "uk" | "nz" | "sg";
export type FactStatus =
  | "AVAILABLE"
  | "NOT_AVAILABLE"
  | "NOT_APPLICABLE"
  | "SUPPRESSED"
  | "STALE";
export type MappingQuality = "EXACT" | "STRONG" | "APPROXIMATE" | "BROAD" | "NO_EQUIVALENT" | "REVIEW_REQUIRED" | "CLOSE" | "BROADER" | "NARROWER" | "PARTIAL" | "MANUAL_REVIEW";
export type MappingMethod = "OFFICIAL_CONCORDANCE" | "EXPERT_REVIEW" | "TITLE_AND_TASK_REVIEW" | "LEGACY_SEED";
export type Confidence = "HIGH" | "MEDIUM" | "LOW";
export type CapabilityLevel = "EXCELLENT" | "GOOD" | "LIMITED" | "UNAVAILABLE";

export type MetricKey =
  | "annualMedian"
  | "nativeMedian"
  | "hourlyMedian"
  | "range"
  | "employment"
  | "employmentChange"
  | "earningsChange"
  | "projectedGrowth"
  | "annualOpenings"
  | "education"
  | "credential";

export type Provenance = {
  sourceId: string;
  sourceReleaseId: string;
  referencePeriod: string;
  geographyId: string;
  retrievedAt: string;
  qualityStatus: "OFFICIAL" | "DERIVED" | "BENCHMARK" | "PROVISIONAL";
};

export type Fact<T> = {
  status: FactStatus;
  value: T | null;
  unit?: string;
  label: string;
  provenance?: Provenance;
  derivation?: {
    method: string;
    inputFactKeys: string[];
    assumptions: string[];
  };
  note?: string;
};

export type OccupationMapping = {
  taxonomyId: string;
  taxonomyVersion: string;
  occupationCode: string;
  localTitle: string;
  quality: MappingQuality;
  method: MappingMethod;
  confidence: Confidence;
  sourceId: string;
  notes?: string;
  reviewedAt: string;
  coverageWeight?: number;
};

export type CareerMarketRecord = {
  canonicalCareerId: CanonicalCareerId;
  countryId: CountryId;
  localTitle: string;
  titleVariants: string[];
  countryDescription?: string;
  educationNotes?: string;
  licensingRequirements?: string;
  regulatoryNotes?: string;
  mappings: OccupationMapping[];
  facts: Record<MetricKey, Fact<number | string>>;
  salaryBasis: "ANNUAL" | "WEEKLY_ANNUALISED" | "HOURLY_ANNUALISED" | "MONTHLY_ANNUALISED" | "RANGE_MIDPOINT";
  education: string;
  credential: string;
  availability: FactStatus;
  lastReviewedAt: string;
};

export type CountryCapability = {
  level: CapabilityLevel;
  status: FactStatus;
  sourceIds: string[];
  note: string;
};

export type CountryRegistryEntry = {
  id: CountryId;
  iso2: string;
  slug: string;
  label: string;
  shortLabel: string;
  aliases: string[];
  locale: string;
  currency: string;
  enabled: boolean;
  pilot: boolean;
  occupationTaxonomy: { id: string; label: string; version: string };
  capabilities: Record<"salary" | "employment" | "outlook" | "education" | "licensing" | "subnational", CountryCapability>;
  trustSignals: string[];
  sourceNote: string;
  methodNote: string;
  footerSource: string;
  workSignalNote: string;
  momentumMetric: MetricKey | null;
  momentumLabel: string;
  minimumCoverage: { careers: number; annualSalaryFacts: number; mappingsReviewed: number };
};

export type CountryAdapter = {
  countryId: CountryId;
  schemaVersion: "1.0";
  records: Record<CareerKey, CareerMarketRecord>;
};
