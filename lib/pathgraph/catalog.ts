import type { CanonicalCareerId, CareerKey } from "./model";

export const canonicalCareers: Record<CareerKey, { id: CanonicalCareerId; title: string; isco08: string[] }> = {
  rn: { id: "registered-nurse", title: "Registered Nurse", isco08: ["2221"] },
  software: { id: "software-developer", title: "Software Developer", isco08: ["2512"] },
  electrician: { id: "electrician", title: "Electrician", isco08: ["7411"] },
  accountant: { id: "accountant", title: "Accountant", isco08: ["2411"] },
  dental: { id: "dental-hygienist", title: "Dental Hygienist", isco08: ["3251"] },
  sonographer: { id: "diagnostic-medical-sonographer", title: "Diagnostic Medical Sonographer", isco08: ["3212"] },
  plumber: { id: "plumber", title: "Plumber", isco08: ["7126"] },
  designer: { id: "graphic-designer", title: "Graphic Designer", isco08: ["2166"] },
  security: { id: "information-security-analyst", title: "Information Security Analyst", isco08: ["2529"] },
  teacher: { id: "secondary-school-teacher", title: "Secondary School Teacher", isco08: ["2330"] },
  enrolledNurse: { id: "enrolled-nurse", title: "Enrolled Nurse", isco08: ["3221"] },
  radiologicTech: { id: "radiologic-technologist", title: "Radiologic Technologist", isco08: ["3211"] },
  occupationalTherapist: { id: "occupational-therapist", title: "Occupational Therapist", isco08: ["2268"] },
  physiotherapist: { id: "physiotherapist", title: "Physiotherapist", isco08: ["2264"] },
  hvac: { id: "hvac-technician", title: "HVAC Technician", isco08: ["7127"] },
  welder: { id: "welder", title: "Welder", isco08: ["7212"] },
  carpenter: { id: "carpenter", title: "Carpenter", isco08: ["7115"] },
  automotiveTech: { id: "automotive-technician", title: "Automotive Technician", isco08: ["7231"] },
  financialAnalyst: { id: "financial-analyst", title: "Financial Analyst", isco08: ["2413"] },
  systemsAnalyst: { id: "systems-analyst", title: "Systems Analyst", isco08: ["2511"] },
};
