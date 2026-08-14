import { buildRecord, type SeedRecord } from "./build-record";
import type { CareerKey, CountryAdapter } from "../model";

const common = {
  countryId: "nz",
  taxonomyId: "NOL",
  taxonomyVersion: "3.0",
  sourceId: "nz-stats-nol",
  salarySourceId: "nz-tahatu-careers-2026",
  releaseId: "nol-3.0",
  salaryReleaseId: "tahatu-reviewed-2026-08",
  referencePeriod: "NOL 3.0 / Tahatū reviewed August 2026",
  salaryReferencePeriod: "Current published Tahatū range; reviewed 14 August 2026",
  reviewedAt: "2026-08-14",
  metricSourceIds: { education: "nz-tahatu-careers-2026" },
} as const;

const range = (low: number, high: number) => ({ value: (low + high) / 2, unit: "NZD/year" as const, basis: "RANGE_MIDPOINT" as const, low, high });

const seeds: Record<CareerKey, Omit<SeedRecord, keyof typeof common | "key">> = {
  rn: { code: "2544", localTitle: "Registered Nurse", salary: range(74000, 153000), education: "Bachelor of Nursing", credential: "Nursing Council registration required" },
  software: { code: "2613", salary: range(85000, 139000), education: "Degree, diploma or demonstrated experience", credential: "Portfolio and experience valued" },
  electrician: { code: "3411", salary: range(64000, 104000), education: "New Zealand Certificate pathway", credential: "Apprenticeship and practising licence" },
  accountant: { code: "2211", salary: range(63000, 125000), education: "Degree or professional pathway", credential: "CA ANZ pathway for chartered status" },
  dental: { code: "4112", localTitle: "Oral Health Therapist", mappingQuality: "STRONG", salary: range(59000, 119000), education: "Approved oral health degree", credential: "Dental Council registration required" },
  sonographer: { code: "2512", salary: range(70000, 120000), education: "Medical imaging degree plus ultrasound training", credential: "Professional registration or accreditation required" },
  plumber: { code: "3341", salary: range(50000, 110000), education: "New Zealand Certificate pathway", credential: "Apprenticeship and practising licence" },
  designer: { code: "2324", salary: range(54000, 90000), education: "Degree, diploma or portfolio route", credential: "Portfolio typically expected" },
  security: { code: "2621", localTitle: "Cybersecurity Specialist", mappingQuality: "STRONG", salary: range(80000, 140000), education: "Degree, diploma or industry route", credential: "Experience and certification valued" },
  teacher: { code: "2414", salary: range(64000, 103000), education: "Teaching degree or graduate diploma", credential: "Teaching Council registration required" },
  enrolledNurse: { code: "4114", salary: range(61000, 88000), education: "Diploma in Enrolled Nursing", credential: "Nursing Council registration required" },
  radiologicTech: { code: "2512", localTitle: "Medical Radiation Technologist", mappingQuality: "STRONG", salary: range(63000, 118000), education: "Approved medical imaging degree", credential: "MRT Board registration required" },
  occupationalTherapist: { code: "2524", salary: range(58000, 119000), education: "Approved occupational therapy degree", credential: "Occupational Therapy Board registration required" },
  physiotherapist: { code: "2525", salary: range(64000, 99000), education: "Approved physiotherapy degree", credential: "Physiotherapy Board registration required" },
  hvac: { code: "3421", localTitle: "Air-conditioning and Refrigeration Mechanic", salary: range(50000, 95000), education: "New Zealand Certificate pathway", credential: "Apprenticeship and electrical/refrigerant certification may apply" },
  welder: { code: "3223", salary: range(60000, 85000), education: "Certificate or apprenticeship route", credential: "Trade certification valued" },
  carpenter: { code: "3312", salary: range(50000, 90000), education: "New Zealand Certificate pathway", credential: "Apprenticeship common" },
  automotiveTech: { code: "3212", localTitle: "Automotive Technician", salary: range(50000, 95000), education: "New Zealand Certificate pathway", credential: "Apprenticeship common" },
  financialAnalyst: { code: "2223", mappingQuality: "STRONG", salary: range(70000, 130000), education: "Finance, economics or accounting degree common", credential: "Professional credentials may help" },
  systemsAnalyst: { code: "2611", salary: range(85000, 130000), education: "Degree, diploma or demonstrated experience", credential: "Industry experience and certification valued" },
};

export const nzAdapter: CountryAdapter = {
  countryId: "nz",
  schemaVersion: "1.0",
  records: Object.fromEntries(Object.entries(seeds).map(([key, seed]) => [key, buildRecord({ ...common, ...seed, key: key as CareerKey })])) as CountryAdapter["records"],
};
