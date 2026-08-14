import { buildRecord, type SeedRecord } from "./build-record";
import type { CareerKey, CountryAdapter } from "../model";

const common = { countryId: "ca", taxonomyId: "NOC", taxonomyVersion: "2021", sourceId: "ca-job-bank-wages-2025", releaseId: "2025-11", referencePeriod: "November 2025", reviewedAt: "2026-08-14", metricSourceIds: { education: "ca-job-bank-requirements-2025" } } as const;
const seeds: Record<CareerKey, Omit<SeedRecord, keyof typeof common | "key">> = {
  rn: { code: "31301", salary: { value: 43.27, unit: "CAD/hour" }, education: "University degree", credential: "Provincial nursing registration" },
  software: { code: "21232", salary: { value: 48.08, unit: "CAD/hour" }, education: "University degree", credential: "Experience / portfolio valued" },
  electrician: { code: "72200", salary: { value: 35, unit: "CAD/hour" }, education: "College or apprenticeship", credential: "Trade certification varies by province" },
  accountant: { code: "11100", salary: { value: 40.36, unit: "CAD/hour" }, education: "University degree", credential: "CPA pathway for designation" },
  dental: { code: "32111", salary: { value: 45, unit: "CAD/hour" }, education: "College diploma", credential: "Provincial registration required" },
  sonographer: { code: "32122", salary: { value: 42, unit: "CAD/hour" }, education: "College diploma", credential: "Professional certification commonly required" },
  plumber: { code: "72300", salary: { value: 34, unit: "CAD/hour" }, education: "College or apprenticeship", credential: "Trade certification varies by province" },
  designer: { code: "52120", salary: { value: 31.25, unit: "CAD/hour" }, education: "College diploma common", credential: "Portfolio typically expected" },
  security: { code: "21220", salary: { value: 49.52, unit: "CAD/hour" }, education: "University degree", credential: "Experience / certification valued" },
  teacher: { code: "41220", salary: { value: 45.67, unit: "CAD/hour" }, education: "University degree", credential: "Provincial teaching certificate" },
  enrolledNurse: { code: "32101", localTitle: "Licensed Practical Nurse", salary: { value: 31.32, unit: "CAD/hour" }, education: "College diploma", credential: "Provincial nursing registration" },
  radiologicTech: { code: "32121", localTitle: "Medical Radiation Technologist", salary: { value: 40, unit: "CAD/hour" }, education: "College diploma", credential: "Provincial registration may apply" },
  occupationalTherapist: { code: "31203", salary: { value: 46, unit: "CAD/hour" }, education: "University degree", credential: "Provincial registration required" },
  physiotherapist: { code: "31202", salary: { value: 46, unit: "CAD/hour" }, education: "University degree", credential: "Provincial registration required" },
  hvac: { code: "72402", localTitle: "Heating, Refrigeration and Air Conditioning Mechanic", salary: { value: 37.5, unit: "CAD/hour" }, education: "College or apprenticeship", credential: "Trade certification varies by province" },
  welder: { code: "72106", salary: { value: 30, unit: "CAD/hour" }, education: "College or apprenticeship", credential: "Trade certification varies by province" },
  carpenter: { code: "72310", salary: { value: 32, unit: "CAD/hour" }, education: "College or apprenticeship", credential: "Trade certification varies by province" },
  automotiveTech: { code: "72410", localTitle: "Automotive Service Technician", salary: { value: 30, unit: "CAD/hour" }, education: "College or apprenticeship", credential: "Trade certification varies by province" },
  financialAnalyst: { code: "11101", localTitle: "Financial and Investment Analyst", salary: { value: 42.31, unit: "CAD/hour" }, education: "University degree", credential: "Professional designation may be required" },
  systemsAnalyst: { code: "21221", localTitle: "Business Systems Specialist", mappingQuality: "STRONG", salary: { value: 46.15, unit: "CAD/hour" }, education: "University degree", credential: "Experience / certification valued" },
};

export const caAdapter: CountryAdapter = { countryId: "ca", schemaVersion: "1.0", records: Object.fromEntries(Object.entries(seeds).map(([key, seed]) => [key, buildRecord({ ...common, ...seed, key: key as CareerKey })])) as CountryAdapter["records"] };
