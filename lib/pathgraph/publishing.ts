import { canonicalCareers } from "./catalog";
import { getComparisonRows, getMarket, getRecord } from "./service";
import { countryRegistry } from "./registry";
import type { CareerKey, CountryId } from "./model";

export type ApprovedComparison = {
  left: CareerKey;
  right: CareerKey;
  slug: string;
  priority: number;
  indexable: boolean;
  reason: string;
};

export type CareerPublicationState = "FULL" | "GOOD" | "LIMITED" | "REVIEW" | "DO_NOT_PUBLISH";

export const careerQuality: Record<CareerKey, { state: CareerPublicationState; note: string }> = {
  rn: { state: "FULL", note: "Strong salary, taxonomy and pathway coverage in all six countries." },
  software: { state: "FULL", note: "Strong salary and taxonomy coverage in all six countries." },
  electrician: { state: "FULL", note: "Strong licensed-trade coverage across all six markets." },
  accountant: { state: "FULL", note: "Strong professional mapping and salary coverage across all six markets." },
  dental: { state: "GOOD", note: "Publishable with Singapore salary explicitly unavailable at this granularity." },
  sonographer: { state: "GOOD", note: "Publishable; some national taxonomies group diagnostic-imaging roles." },
  plumber: { state: "FULL", note: "Strong trade mapping and salary coverage across all six markets." },
  designer: { state: "GOOD", note: "Publishable with broader occupation-group mappings clearly labelled." },
  security: { state: "GOOD", note: "Publishable with fast-evolving local occupation classifications noted." },
  teacher: { state: "GOOD", note: "Publishable with Singapore salary explicitly unavailable at this granularity." },
  enrolledNurse: { state: "GOOD", note: "Publishable; the UK has no direct regulated equivalent and labels its proxy." },
  radiologicTech: { state: "FULL", note: "Strong diagnostic-imaging mapping and salary coverage." },
  occupationalTherapist: { state: "FULL", note: "Strong professional mapping and salary coverage." },
  physiotherapist: { state: "FULL", note: "Strong professional mapping and salary coverage." },
  hvac: { state: "GOOD", note: "Publishable with some broader mechanical-services groupings." },
  welder: { state: "FULL", note: "Strong trade mapping and salary coverage." },
  carpenter: { state: "FULL", note: "Strong construction-trade mapping and salary coverage." },
  automotiveTech: { state: "FULL", note: "Strong vehicle-trade mapping and salary coverage." },
  financialAnalyst: { state: "GOOD", note: "Publishable with one broader Australian grouping clearly labelled." },
  systemsAnalyst: { state: "FULL", note: "Strong technology mapping and salary coverage." },
};

const pair = (left: CareerKey, right: CareerKey, priority: number, reason: string): ApprovedComparison => ({
  left,
  right,
  slug: [canonicalCareers[left].id, canonicalCareers[right].id].sort().join("-vs-"),
  priority,
  indexable: true,
  reason,
});

export const comparisonManifest: ApprovedComparison[] = [
  pair("rn", "dental", 100, "Closely related patient-care paths with different entry and work settings."),
  pair("rn", "sonographer", 99, "Common healthcare decision with useful pay, training and work-context trade-offs."),
  pair("electrician", "plumber", 98, "Two established skilled-trade pathways with strong user intent."),
  pair("software", "security", 97, "Adjacent technology paths with distinct specialisation and work signals."),
  pair("dental", "sonographer", 96, "Allied-health careers with comparable technical and patient-facing work."),
  pair("rn", "teacher", 90, "People-centred professional careers with meaningful schedule and pressure differences."),
  pair("rn", "software", 89, "A high-contrast career-change comparison with strong pay and work-style trade-offs."),
  pair("rn", "security", 87, "A healthcare-to-technology transition comparison with distinct entry requirements."),
  pair("accountant", "software", 86, "Analytical professional paths often considered by career changers."),
  pair("accountant", "security", 85, "Risk, systems and analytical work with different technical requirements."),
  pair("designer", "software", 84, "Closely adjacent digital careers balancing visual and technical work."),
  pair("designer", "security", 80, "Digital careers with contrasting creative and protective systems work."),
  pair("software", "teacher", 79, "Professional paths with different people contact, schedules and entry routes."),
  pair("electrician", "software", 78, "Hands-on trade versus digital technical work is a useful career-change choice."),
  pair("electrician", "security", 77, "Technical troubleshooting paths in physical and digital systems."),
  pair("electrician", "designer", 72, "Practical and creative production careers with contrasting work environments."),
  pair("accountant", "designer", 71, "Structured analytical work versus creative visual production."),
  pair("accountant", "teacher", 70, "Established professional paths with different people and schedule demands."),
  pair("accountant", "rn", 69, "Professional career-change comparison across business and healthcare."),
  pair("dental", "teacher", 68, "People-facing careers with different clinical, education and schedule realities."),
  pair("dental", "designer", 65, "A focused clinical path versus a creative production path."),
  pair("sonographer", "teacher", 64, "Technical patient care versus classroom-focused people work."),
  pair("sonographer", "security", 63, "Technology-enabled careers in healthcare and digital risk."),
  pair("plumber", "software", 62, "Hands-on systems work versus software systems work."),
  pair("plumber", "security", 61, "Practical infrastructure versus digital infrastructure protection."),
  pair("plumber", "designer", 60, "Hands-on trade work versus creative visual work."),
  pair("security", "teacher", 59, "Technical risk work versus people-centred education."),
  pair("software", "sonographer", 58, "Technology-intensive careers with different human-contact requirements."),
  pair("rn", "enrolledNurse", 96, "Two nursing pathways with different education, scope and earning profiles."),
  pair("rn", "radiologicTech", 95, "Patient-care careers with different diagnostic, technical and clinical responsibilities."),
  pair("rn", "occupationalTherapist", 94, "Healthcare professions balancing direct care, rehabilitation and entry requirements."),
  pair("rn", "physiotherapist", 93, "High-interest healthcare choice with distinct physical, clinical and training demands."),
  pair("enrolledNurse", "dental", 88, "Shorter-entry clinical careers with different patient-care settings."),
  pair("enrolledNurse", "sonographer", 87, "Nursing support versus diagnostic imaging with meaningful training trade-offs."),
  pair("enrolledNurse", "radiologicTech", 86, "Accessible clinical pathways with different technical specialisation."),
  pair("enrolledNurse", "occupationalTherapist", 85, "Direct nursing care versus rehabilitation-focused professional practice."),
  pair("enrolledNurse", "physiotherapist", 84, "Two patient-facing paths with very different qualification routes."),
  pair("radiologicTech", "sonographer", 92, "Closely related medical-imaging careers with strong decision intent."),
  pair("radiologicTech", "occupationalTherapist", 83, "Diagnostic imaging versus rehabilitation practice."),
  pair("radiologicTech", "physiotherapist", 82, "Technical imaging and movement-focused therapy compared."),
  pair("occupationalTherapist", "physiotherapist", 91, "Closely adjacent rehabilitation careers with different practice emphasis."),
  pair("occupationalTherapist", "teacher", 81, "People-centred careers connecting development, learning and support."),
  pair("occupationalTherapist", "dental", 80, "Allied-health careers with contrasting scope and work settings."),
  pair("physiotherapist", "dental", 79, "Patient-facing health careers with different physical and clinical demands."),
  pair("physiotherapist", "sonographer", 78, "Hands-on rehabilitation versus diagnostic technology."),
  pair("radiologicTech", "dental", 77, "Focused clinical careers with different imaging and preventive-care roles."),
  pair("sonographer", "occupationalTherapist", 76, "Technical diagnosis versus longer-term functional rehabilitation."),
  pair("electrician", "hvac", 95, "Adjacent licensed trades with strong systems and troubleshooting overlap."),
  pair("electrician", "welder", 88, "Skilled trades with different precision, licensing and work-environment demands."),
  pair("electrician", "carpenter", 87, "Two apprenticeship pathways with different materials and technical systems."),
  pair("electrician", "automotiveTech", 86, "Technical fault-finding across building and vehicle systems."),
  pair("plumber", "hvac", 94, "Closely related building-services trades with strong comparison intent."),
  pair("plumber", "carpenter", 85, "Construction trades with different systems, tools and licensing routes."),
  pair("plumber", "welder", 84, "Pipe systems and fabrication compared across training and work context."),
  pair("hvac", "automotiveTech", 83, "Mechanical diagnostic careers across buildings and vehicles."),
  pair("hvac", "welder", 82, "Mechanical service work versus metal fabrication."),
  pair("hvac", "carpenter", 81, "Building-services systems versus structural construction work."),
  pair("welder", "carpenter", 80, "Fabrication and construction trades with different materials and environments."),
  pair("welder", "automotiveTech", 79, "Metal fabrication versus vehicle diagnosis and repair."),
  pair("carpenter", "automotiveTech", 78, "Hands-on technical careers across construction and transport."),
  pair("accountant", "financialAnalyst", 95, "Closely related finance careers with clear reporting-versus-analysis trade-offs."),
  pair("financialAnalyst", "software", 86, "Analytical professional paths across finance and technology."),
  pair("financialAnalyst", "security", 85, "Risk and analysis careers in financial and cyber systems."),
  pair("financialAnalyst", "systemsAnalyst", 90, "Business analysis roles with different financial and technology focus."),
  pair("financialAnalyst", "designer", 74, "Quantitative analysis versus creative visual production."),
  pair("software", "systemsAnalyst", 96, "Adjacent technology careers with strong build-versus-analysis intent."),
  pair("security", "systemsAnalyst", 93, "Closely related systems careers with different risk and solution focus."),
  pair("designer", "systemsAnalyst", 82, "Digital product work across visual and systems perspectives."),
  pair("accountant", "systemsAnalyst", 88, "Structured business analysis across finance and information systems."),
  pair("teacher", "physiotherapist", 73, "People-focused professions with different settings, credentials and physical demands."),
  pair("teacher", "radiologicTech", 72, "Education versus technical healthcare work."),
  pair("teacher", "enrolledNurse", 71, "Service careers with different schedules, pressure and entry routes."),
  pair("automotiveTech", "software", 70, "Diagnostic problem-solving in physical and digital systems."),
  pair("hvac", "software", 69, "Technical systems careers spanning hands-on and digital work."),
  pair("carpenter", "designer", 68, "Creative production through physical construction or visual communication."),
  pair("financialAnalyst", "teacher", 67, "Analytical finance versus people-centred education."),
];

export const enabledCountryIds = Object.values(countryRegistry)
  .filter((country) => country.enabled)
  .map((country) => country.id);

export function careerKeyFromSlug(slug: string) {
  return (Object.keys(canonicalCareers) as CareerKey[]).find((key) => canonicalCareers[key].id === slug) ?? null;
}

export function canonicalComparisonSlug(left: CareerKey, right: CareerKey) {
  return [canonicalCareers[left].id, canonicalCareers[right].id].sort().join("-vs-");
}

export function comparisonForKeys(left: CareerKey, right: CareerKey) {
  const slug = canonicalComparisonSlug(left, right);
  return comparisonManifest.find((item) => item.slug === slug) ?? null;
}

export function comparisonFromSlug(slug: string) {
  const direct = comparisonManifest.find((item) => item.slug === slug);
  if (direct) return { comparison: direct, reversed: false };
  for (const item of comparisonManifest) {
    const forwardSlug = `${canonicalCareers[item.left].id}-vs-${canonicalCareers[item.right].id}`;
    const reversedSlug = [canonicalCareers[item.right].id, canonicalCareers[item.left].id].join("-vs-");
    if (slug === forwardSlug || slug === reversedSlug) return { comparison: item, reversed: slug !== item.slug };
  }
  return null;
}

export function isCareerIndexable(career: CareerKey) {
  if (!["FULL", "GOOD"].includes(careerQuality[career].state)) return false;
  const usableMarkets = enabledCountryIds.filter((country) => {
    const record = getRecord(career, country);
    const mapping = record.mappings[0];
    return record.availability === "AVAILABLE"
      && record.facts.annualMedian.status === "AVAILABLE"
      && mapping
      && mapping.confidence !== "LOW";
  });
  return usableMarkets.length >= 2;
}

export function isComparisonIndexable(item: ApprovedComparison) {
  if (!item.indexable || !isCareerIndexable(item.left) || !isCareerIndexable(item.right)) return false;
  const usefulMarkets = enabledCountryIds.filter((country) => {
    const rows = getComparisonRows(getMarket(item.left, country), getMarket(item.right, country), country);
    return rows.length >= 4;
  });
  return usefulMarkets.length >= 2;
}

export function publishedCareers() {
  return (Object.keys(canonicalCareers) as CareerKey[]).filter(isCareerIndexable);
}

export function publishedComparisons() {
  return comparisonManifest.filter(isComparisonIndexable).sort((a, b) => b.priority - a.priority);
}

export function comparisonsForCareer(career: CareerKey, limit = 6) {
  return publishedComparisons().filter((item) => item.left === career || item.right === career).slice(0, limit);
}

export function relatedComparisons(current: ApprovedComparison, limit = 6) {
  return publishedComparisons()
    .filter((item) => item.slug !== current.slug && [item.left, item.right].some((key) => key === current.left || key === current.right))
    .slice(0, limit);
}

export function careerLastModified(career: CareerKey) {
  return enabledCountryIds.reduce((latest, country) => {
    const reviewed = getRecord(career, country).lastReviewedAt;
    return reviewed > latest ? reviewed : latest;
  }, "2025-01-01");
}

export function comparisonLastModified(item: ApprovedComparison) {
  return [careerLastModified(item.left), careerLastModified(item.right)].sort().at(-1) ?? "2025-01-01";
}

export function normaliseCountry(value?: string): CountryId {
  return enabledCountryIds.includes(value as CountryId) ? value as CountryId : "us";
}
