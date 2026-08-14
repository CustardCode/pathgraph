import { buildRecord, type SeedRecord } from "./build-record";
import type { CareerKey, CountryAdapter } from "../model";

const common = { countryId: "us", taxonomyId: "ONET_SOC", taxonomyVersion: "2019", sourceId: "us-bls-oews-2025", releaseId: "2025-05", referencePeriod: "May 2025 / 2024–2034", reviewedAt: "2026-08-14", metricSourceIds: { outlook: "us-bls-projections-2024-34", education: "us-onet-30-3" } } as const;
const seeds: Record<CareerKey, Omit<SeedRecord, keyof typeof common | "key">> = {
  rn: { code: "29-1141.00", salary: { value: 97550, unit: "USD/year", low: 68940, high: 137470 }, p10: 68940, p90: 137470, employment: 3379720, projectedGrowth: 4.9, annualOpenings: 189100, education: "Bachelor’s degree", credential: "Licensure required" },
  software: { code: "15-1252.00", salary: { value: 135980, unit: "USD/year" }, p10: 82460, p90: 214670, employment: 1687890, projectedGrowth: 15.8, annualOpenings: 115200, education: "Bachelor’s degree", credential: "No typical OJT" },
  electrician: { code: "47-2111.00", salary: { value: 63190, unit: "USD/year" }, p10: 42640, p90: 108510, employment: 757220, projectedGrowth: 9.5, annualOpenings: 81000, education: "High school diploma", credential: "Apprenticeship" },
  accountant: { code: "13-2011.00", salary: { value: 83680, unit: "USD/year" }, p10: 56020, p90: 144090, employment: 1449500, projectedGrowth: 4.6, annualOpenings: 124200, education: "Bachelor’s degree", credential: "No typical OJT" },
  dental: { code: "29-1292.00", salary: { value: 98100, unit: "USD/year" }, p10: 74880, p90: 126050, employment: 222740, projectedGrowth: 7, annualOpenings: 15300, education: "Associate’s degree", credential: "Licensure required" },
  sonographer: { code: "29-2032.00", salary: { value: 96590, unit: "USD/year" }, p10: 67820, p90: 129370, employment: 90160, projectedGrowth: 13, annualOpenings: 5800, education: "Associate’s degree", credential: "No typical OJT" },
  plumber: { code: "47-2152.00", salary: { value: 63800, unit: "USD/year" }, p10: 44150, p90: 108420, employment: 465840, projectedGrowth: 4.5, annualOpenings: 44000, education: "High school diploma", credential: "Apprenticeship" },
  designer: { code: "27-1024.00", salary: { value: 62960, unit: "USD/year" }, p10: 39520, p90: 104910, employment: 197830, projectedGrowth: 2.1, annualOpenings: 20000, education: "Bachelor’s degree", credential: "No typical OJT" },
  security: { code: "15-1212.00", salary: { value: 129180, unit: "USD/year" }, p10: 75090, p90: 199850, employment: 190650, projectedGrowth: 28.5, annualOpenings: 16000, education: "Bachelor’s degree", credential: "Experience often expected" },
  teacher: { code: "25-2031.00", salary: { value: 72040, unit: "USD/year" }, p10: 48780, p90: 107600, employment: 1065210, projectedGrowth: -1.6, annualOpenings: 66200, education: "Bachelor’s degree", credential: "Certification varies" },
  enrolledNurse: { code: "29-2061.00", localTitle: "Licensed Practical / Vocational Nurse", salary: { value: 62340, unit: "USD/year" }, projectedGrowth: 3, annualOpenings: 54100, education: "Postsecondary nondegree award", credential: "State licensure required" },
  radiologicTech: { code: "29-2034.00", localTitle: "Radiologic Technologist", salary: { value: 77660, unit: "USD/year" }, projectedGrowth: 5, annualOpenings: 15400, education: "Associate’s degree", credential: "Licensure or certification varies" },
  occupationalTherapist: { code: "29-1122.00", salary: { value: 98340, unit: "USD/year" }, projectedGrowth: 11, annualOpenings: 10100, education: "Master’s degree", credential: "State licensure required" },
  physiotherapist: { code: "29-1123.00", localTitle: "Physical Therapist", salary: { value: 101020, unit: "USD/year" }, projectedGrowth: 11, annualOpenings: 13200, education: "Doctoral or professional degree", credential: "State licensure required" },
  hvac: { code: "49-9021.00", localTitle: "HVACR Mechanic and Installer", salary: { value: 59810, unit: "USD/year" }, projectedGrowth: 8, annualOpenings: 40100, education: "Postsecondary nondegree award", credential: "Certification or licence may apply" },
  welder: { code: "51-4121.00", localTitle: "Welder, Cutter, Solderer and Brazer", salary: { value: 51000, unit: "USD/year" }, projectedGrowth: 2, annualOpenings: 45600, education: "High school diploma", credential: "Technical training common" },
  carpenter: { code: "47-2031.00", salary: { value: 59310, unit: "USD/year" }, projectedGrowth: 4, annualOpenings: 79500, education: "High school diploma", credential: "Apprenticeship common" },
  automotiveTech: { code: "49-3023.00", localTitle: "Automotive Service Technician", salary: { value: 49670, unit: "USD/year" }, projectedGrowth: 4, annualOpenings: 70000, education: "Postsecondary nondegree award", credential: "Industry certification valued" },
  financialAnalyst: { code: "13-2051.00", salary: { value: 101910, unit: "USD/year" }, projectedGrowth: 6, annualOpenings: 29900, education: "Bachelor’s degree", credential: "Professional certification may help" },
  systemsAnalyst: { code: "15-1211.00", localTitle: "Computer Systems Analyst", salary: { value: 103790, unit: "USD/year" }, projectedGrowth: 9, annualOpenings: 34200, education: "Bachelor’s degree", credential: "Industry experience valued" },
};

export const usAdapter: CountryAdapter = { countryId: "us", schemaVersion: "1.0", records: Object.fromEntries(Object.entries(seeds).map(([key, seed]) => [key, buildRecord({ ...common, ...seed, key: key as CareerKey })])) as CountryAdapter["records"] };
