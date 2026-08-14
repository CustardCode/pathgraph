import { available, emptyFacts } from "../facts";
import { canonicalCareers } from "../catalog";
import { buildRecord, type SeedRecord } from "./build-record";
import type { CareerKey, CareerMarketRecord, CountryAdapter, MappingQuality, Provenance } from "../model";

const reviewedAt = "2026-08-14";
const common = {
  countryId: "sg",
  taxonomyId: "SSOC",
  taxonomyVersion: "2024",
  sourceId: "sg-ssoc-2024",
  salarySourceId: "sg-mom-occupational-wages-2024-open",
  releaseId: "ssoc-2024",
  salaryReleaseId: "mom-resident-wages-2024",
  referencePeriod: "SSOC 2024 / June 2024 wages",
  salaryReferencePeriod: "June 2024",
  reviewedAt,
  metricSourceIds: { education: "sg-skillsfuture-frameworks" },
} as const;

const seeds: Partial<Record<CareerKey, Omit<SeedRecord, keyof typeof common | "key">>> = {
  rn: { code: "22201", localTitle: "Registered Nurse and Other Nursing Professional", mappingQuality: "STRONG", salary: { value: 5276, unit: "SGD/month" }, education: "Recognised nursing diploma or degree", credential: "Singapore Nursing Board registration required" },
  software: { code: "25121", salary: { value: 8888, unit: "SGD/month" }, education: "Degree, diploma or demonstrated technical route", credential: "Experience and portfolio valued" },
  electrician: { code: "74110", salary: { value: 3000, unit: "SGD/month" }, education: "ITE or apprenticeship-style technical route", credential: "Licensed Electrical Worker status applies to regulated work" },
  accountant: { code: "24111", localTitle: "Accountant (excluding Tax Accountant)", salary: { value: 5498, unit: "SGD/month" }, education: "Accounting degree or professional route", credential: "Professional designation varies" },
  sonographer: { code: "32112", salary: { value: 5200, unit: "SGD/month" }, education: "Medical imaging qualification plus ultrasound training", credential: "Employer and professional requirements apply" },
  plumber: { code: "71260", salary: { value: 2400, unit: "SGD/month" }, education: "Technical training route", credential: "PUB licensing applies to regulated plumbing work" },
  designer: { code: "21661", salary: { value: 3765, unit: "SGD/month" }, education: "Design diploma, degree or portfolio route", credential: "Portfolio typically expected" },
  security: { code: "25290", localTitle: "Security Operations Specialist", mappingQuality: "STRONG", salary: { value: 7700, unit: "SGD/month" }, education: "ICT or cybersecurity route", credential: "Experience and certification valued" },
  enrolledNurse: { code: "32201", localTitle: "Enrolled / Assistant Nurse", mappingQuality: "STRONG", salary: { value: 4904, unit: "SGD/month" }, education: "Recognised enrolled nursing programme", credential: "Singapore Nursing Board registration required" },
  radiologicTech: { code: "32111", localTitle: "Medical Diagnostic Radiographer", mappingQuality: "STRONG", salary: { value: 5716, unit: "SGD/month" }, education: "Recognised diagnostic radiography qualification", credential: "Allied Health Professions Council registration required" },
  occupationalTherapist: { code: "22680", salary: { value: 4933, unit: "SGD/month" }, education: "Recognised occupational therapy degree", credential: "Allied Health Professions Council registration required" },
  physiotherapist: { code: "22640", salary: { value: 4814, unit: "SGD/month" }, education: "Recognised physiotherapy degree", credential: "Allied Health Professions Council registration required" },
  hvac: { code: "71270", localTitle: "Air-conditioning / Refrigeration Equipment Mechanic", salary: { value: 3263, unit: "SGD/month" }, education: "ITE or technical diploma route", credential: "Trade and refrigerant certifications may apply" },
  welder: { code: "72120", localTitle: "Welder and Flame Cutter", salary: { value: 3050, unit: "SGD/month" }, education: "Technical training route", credential: "Welding certification valued" },
  carpenter: { code: "71150", salary: { value: 2902, unit: "SGD/month" }, education: "Technical or workplace training route", credential: "Trade experience valued" },
  automotiveTech: { code: "72310", localTitle: "Automotive Mechanic", salary: { value: 2776, unit: "SGD/month" }, education: "ITE or technical diploma route", credential: "Manufacturer certification valued" },
  financialAnalyst: { code: "24131", salary: { value: 7500, unit: "SGD/month" }, education: "Finance, economics or accounting degree common", credential: "Regulated activities may require approval" },
  systemsAnalyst: { code: "25110", localTitle: "Systems Designer / Analyst", mappingQuality: "STRONG", salary: { value: 6966, unit: "SGD/month" }, education: "ICT degree, diploma or demonstrated route", credential: "Experience and certification valued" },
};

function missingSalaryRecord(key: CareerKey, code: string, localTitle: string, quality: MappingQuality, education: string, credential: string): CareerMarketRecord {
  const facts = emptyFacts();
  const provenance: Provenance = { sourceId: "sg-skillsfuture-frameworks", sourceReleaseId: "reviewed-2026-08", referencePeriod: "Current Skills Framework; reviewed August 2026", geographyId: "SG-NATIONAL", retrievedAt: reviewedAt, qualityStatus: "BENCHMARK" };
  facts.education = available("Typical education", education, "text", provenance);
  facts.credential = available("Training / credential", credential, "text", provenance);
  return {
    canonicalCareerId: canonicalCareers[key].id,
    countryId: "sg",
    localTitle,
    titleVariants: [],
    mappings: [{ taxonomyId: "SSOC", taxonomyVersion: "2024", occupationCode: code, localTitle, quality, method: "TITLE_AND_TASK_REVIEW", confidence: quality === "BROAD" ? "MEDIUM" : "HIGH", sourceId: "sg-ssoc-2024", reviewedAt }],
    facts,
    salaryBasis: "ANNUAL",
    education,
    credential,
    availability: "AVAILABLE",
    lastReviewedAt: reviewedAt,
  };
}

const records = Object.fromEntries(Object.entries(seeds).map(([key, seed]) => [key, buildRecord({ ...common, ...seed!, key: key as CareerKey })])) as Partial<CountryAdapter["records"]>;
records.dental = missingSalaryRecord("dental", "32511", "Oral Health / Dental Therapy Occupation", "BROAD", "Recognised oral health qualification", "Professional registration requirements apply");
records.teacher = missingSalaryRecord("teacher", "23300", "Secondary Education Teacher", "STRONG", "Degree plus teacher preparation", "Ministry of Education requirements apply");

export const sgAdapter: CountryAdapter = { countryId: "sg", schemaVersion: "1.0", records: records as CountryAdapter["records"] };
