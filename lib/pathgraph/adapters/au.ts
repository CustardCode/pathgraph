import { buildRecord, type SeedRecord } from "./build-record";
import type { CareerKey, CountryAdapter } from "../model";

const common = { countryId: "au", taxonomyId: "ANZSCO", taxonomyVersion: "2022", sourceId: "au-jsa-profiles-2026", releaseId: "2026-02", referencePeriod: "May 2025 / February 2026", reviewedAt: "2026-08-14", metricSourceIds: { employment: "au-jsa-profiles-2026", education: "au-jsa-profiles-2026" } } as const;
const seeds: Record<CareerKey, Omit<SeedRecord, keyof typeof common | "key">> = {
  rn: { code: "2544", salary: { value: 2192, unit: "AUD/week" }, hourly: 57, employment: 366200, employmentChange: 12600, education: "Bachelor degree", credential: "AHPRA registration required" },
  software: { code: "2613", salary: { value: 2537, unit: "AUD/week" }, hourly: 67, employment: 203200, employmentChange: 13700, education: "Bachelor degree common", credential: "Experience / portfolio valued" },
  electrician: { code: "3411", salary: { value: 2191, unit: "AUD/week" }, hourly: 55, employment: 197300, employmentChange: 7200, education: "Certificate III/IV", credential: "Apprenticeship + state licence" },
  accountant: { code: "2211", salary: { value: 2003, unit: "AUD/week" }, hourly: 53, employment: 215500, employmentChange: 5800, education: "Bachelor degree common", credential: "Professional accreditation varies" },
  dental: { code: "4112", salary: { value: 2210, unit: "AUD/week" }, hourly: 55, employment: 8000, employmentChange: -200, education: "Diploma or bachelor pathway", credential: "Registration may be required" },
  sonographer: { code: "2512", salary: { value: 2360, unit: "AUD/week" }, hourly: 60, employment: 26000, employmentChange: 1700, education: "Bachelor / postgraduate pathway", credential: "ASAR accreditation required" },
  plumber: { code: "3341", salary: { value: 1990, unit: "AUD/week" }, hourly: 47, employment: 107600, employmentChange: 4500, education: "Certificate III/IV", credential: "Apprenticeship + state licence" },
  designer: { code: "2324", salary: { value: 1850, unit: "AUD/week" }, hourly: 49, employment: 58700, employmentChange: 1400, education: "Bachelor degree common", credential: "Portfolio typically expected" },
  security: { code: "2621", salary: { value: 2461, unit: "AUD/week" }, hourly: 66, employment: 72600, employmentChange: 3300, education: "Bachelor degree common", credential: "Experience / certification valued" },
  teacher: { code: "2414", salary: { value: 2322, unit: "AUD/week" }, hourly: 64, employment: 161400, employmentChange: 6400, education: "Bachelor or postgraduate degree", credential: "Teacher registration required" },
  enrolledNurse: { code: "4114", salary: { value: 1744, unit: "AUD/week" }, hourly: 45, education: "Diploma of Nursing", credential: "AHPRA registration required" },
  radiologicTech: { code: "2512", localTitle: "Medical Imaging Professional", mappingQuality: "STRONG", salary: { value: 2480, unit: "AUD/week" }, hourly: 65, education: "Bachelor degree", credential: "AHPRA registration required" },
  occupationalTherapist: { code: "2524", salary: { value: 1913, unit: "AUD/week" }, hourly: 50, education: "Bachelor or master’s degree", credential: "AHPRA registration required" },
  physiotherapist: { code: "2525", salary: { value: 1888, unit: "AUD/week" }, hourly: 49, education: "Bachelor or postgraduate degree", credential: "AHPRA registration required" },
  hvac: { code: "3421", localTitle: "Airconditioning and Refrigeration Mechanic", salary: { value: 2118, unit: "AUD/week" }, hourly: 53, education: "Certificate III", credential: "Apprenticeship and refrigerant licence" },
  welder: { code: "3223", localTitle: "Structural Steel and Welding Trades Worker", mappingQuality: "STRONG", salary: { value: 1688, unit: "AUD/week" }, hourly: 43, education: "Certificate III", credential: "Apprenticeship common" },
  carpenter: { code: "3312", salary: { value: 1958, unit: "AUD/week" }, hourly: 49, education: "Certificate III", credential: "Apprenticeship common" },
  automotiveTech: { code: "3212", localTitle: "Motor Mechanic", salary: { value: 1751, unit: "AUD/week" }, hourly: 44, education: "Certificate III", credential: "Apprenticeship common" },
  financialAnalyst: { code: "2223", localTitle: "Financial Investment Adviser and Manager", mappingQuality: "BROAD", salary: { value: 2398, unit: "AUD/week" }, hourly: 63, education: "Bachelor degree common", credential: "Professional accreditation varies" },
  systemsAnalyst: { code: "2611", localTitle: "ICT Business and Systems Analyst", mappingQuality: "STRONG", salary: { value: 2697, unit: "AUD/week" }, hourly: 71, education: "Bachelor degree common", credential: "Experience and certification valued" },
};

export const auAdapter: CountryAdapter = { countryId: "au", schemaVersion: "1.0", records: Object.fromEntries(Object.entries(seeds).map(([key, seed]) => [key, buildRecord({ ...common, ...seed, key: key as CareerKey })])) as CountryAdapter["records"] };
