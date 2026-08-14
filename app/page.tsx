"use client";

import { SiteLink as Link } from "@/components/SiteLink";
import { useState, useSyncExternalStore } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { trackEvent } from "@/components/Analytics";
import {
  canonicalCareers,
  classification,
  comparisonForKeys,
  comparisonPath,
  countries,
  getComparisonRows,
  getCountry,
  getDemandVerdict,
  getMarket,
  money,
  relatedComparisons,
  sitePath,
  type CareerKey,
  type CountryId,
  type MarketView,
} from "@/lib/pathgraph";

export type CareerId = CareerKey;
export type SignalKey =
  | "social"
  | "physical"
  | "pressure"
  | "analytical"
  | "people"
  | "technical";
type PriorityKey = "pay" | "momentum" | "entry" | "physical" | "people" | "schedule";
type PriorityWeights = Record<PriorityKey, number>;

export type Career = {
  id: CareerId;
  shortTitle: string;
  group: string;
  kicker: string;
  accent: string;
  schedule: number | null;
  signals: Record<SignalKey, number>;
  strengths: string[];
  summary: string;
};

export const careers: Record<CareerId, Career> = {
  rn: {
    id: "rn",
    shortTitle: "Registered Nurse",
    group: "Healthcare",
    kicker: "People-first care under real pressure",
    accent: "#e2694f",
    schedule: 87.3,
    signals: {
      social: 88.3,
      physical: 58.3,
      pressure: 80.4,
      analytical: 79.4,
      people: 91.3,
      technical: 48.2,
    },
    strengths: ["Active listening", "Critical thinking", "Social perceptiveness"],
    summary: "A people-intensive clinical career centred on patient care, communication and sound judgment.",
  },
  software: {
    id: "software",
    shortTitle: "Software Developer",
    group: "Technology",
    kicker: "Technical systems, creative problem-solving",
    accent: "#3d6d77",
    schedule: 98.4,
    signals: {
      social: 28.6,
      physical: 12.5,
      pressure: 23.1,
      analytical: 70.0,
      people: 30.6,
      technical: 83.4,
    },
    strengths: ["Programming", "Systems analysis", "Complex problem-solving"],
    summary: "A technical career focused on building software systems through analysis, design and problem-solving.",
  },
  electrician: {
    id: "electrician",
    shortTitle: "Electrician",
    group: "Skilled trades",
    kicker: "Hands-on systems and independent judgment",
    accent: "#d29a32",
    schedule: 67.5,
    signals: {
      social: 71.2,
      physical: 96.7,
      pressure: 75.9,
      analytical: 61.6,
      people: 46.3,
      technical: 55.4,
    },
    strengths: ["Troubleshooting", "Repairing", "Equipment selection"],
    summary: "A skilled trade combining electrical systems, practical troubleshooting and hands-on work.",
  },
  accountant: {
    id: "accountant",
    shortTitle: "Accountant",
    group: "Business & finance",
    kicker: "Analytical detail and financial control",
    accent: "#705a8b",
    schedule: null,
    signals: {
      social: 56.4,
      physical: 12.6,
      pressure: 43.4,
      analytical: 69.4,
      people: 50.7,
      technical: 40.2,
    },
    strengths: ["Critical thinking", "Mathematics", "Attention to detail"],
    summary: "An analytical career built around financial records, controls, reporting and professional judgment.",
  },
  dental: {
    id: "dental",
    shortTitle: "Dental Hygienist",
    group: "Healthcare",
    kicker: "Preventive care with a focused clinical scope",
    accent: "#b85a6a",
    schedule: 100.0,
    signals: {
      social: 45.5,
      physical: 57.4,
      pressure: 39.2,
      analytical: 37.3,
      people: 82.8,
      technical: 43.9,
    },
    strengths: ["Social perceptiveness", "Active listening", "Service orientation"],
    summary: "A focused oral-health career combining preventive clinical care with patient education.",
  },
  sonographer: {
    id: "sonographer",
    shortTitle: "Medical Sonographer",
    group: "Healthcare",
    kicker: "Imaging technology with direct patient care",
    accent: "#4b8581",
    schedule: 83.1,
    signals: {
      social: 51.2,
      physical: 64.2,
      pressure: 58.0,
      analytical: 46.7,
      people: 77.6,
      technical: 54.8,
    },
    strengths: ["Active listening", "Monitoring", "Technical imaging"],
    summary: "A medical-imaging career combining diagnostic equipment, technical accuracy and patient contact.",
  },
  plumber: {
    id: "plumber",
    shortTitle: "Plumber",
    group: "Skilled trades",
    kicker: "Mechanical systems and practical problem-solving",
    accent: "#b46a3c",
    schedule: 61.5,
    signals: {
      social: 33.3,
      physical: 91.0,
      pressure: 64.5,
      analytical: 39.6,
      people: 26.9,
      technical: 56.6,
    },
    strengths: ["Troubleshooting", "Repairing", "Equipment selection"],
    summary: "A skilled trade focused on installing, maintaining and repairing water and piping systems.",
  },
  designer: {
    id: "designer",
    shortTitle: "Graphic Designer",
    group: "Design",
    kicker: "Visual communication and creative production",
    accent: "#c95383",
    schedule: 65.0,
    signals: {
      social: 46.0,
      physical: 22.9,
      pressure: 40.1,
      analytical: 38.3,
      people: 51.7,
      technical: 77.6,
    },
    strengths: ["Originality", "Design knowledge", "Technology design"],
    summary: "A creative career using visual systems, communication and production tools to shape information.",
  },
  security: {
    id: "security",
    shortTitle: "Security Analyst",
    group: "Technology",
    kicker: "Protecting systems through analytical vigilance",
    accent: "#5268a5",
    schedule: 89.9,
    signals: {
      social: 40.9,
      physical: 32.2,
      pressure: 38.4,
      analytical: 69.2,
      people: 27.5,
      technical: 81.4,
    },
    strengths: ["Systems analysis", "Critical thinking", "Complex problem-solving"],
    summary: "A technical career protecting digital systems through monitoring, analysis and risk management.",
  },
  teacher: {
    id: "teacher",
    shortTitle: "Secondary Teacher",
    group: "Education",
    kicker: "Teaching, communication and constant variety",
    accent: "#7a9250",
    schedule: 91.5,
    signals: {
      social: 63.9,
      physical: 41.5,
      pressure: 44.9,
      analytical: 64.1,
      people: 81.4,
      technical: 47.0,
    },
    strengths: ["Instructing", "Speaking", "Learning strategies"],
    summary: "A people-oriented career combining subject expertise, communication and classroom leadership.",
  },
  enrolledNurse: {
    id: "enrolledNurse", shortTitle: "Enrolled Nurse", group: "Healthcare", kicker: "Practical nursing through a shorter entry route", accent: "#c96c58", schedule: 70,
    signals: { social: 82, physical: 65, pressure: 72, analytical: 62, people: 88, technical: 42 },
    strengths: ["Patient care", "Active listening", "Monitoring"],
    summary: "A practical nursing career supporting patient care under the direction of registered health professionals.",
  },
  radiologicTech: {
    id: "radiologicTech", shortTitle: "Radiologic Technologist", group: "Healthcare", kicker: "Diagnostic imaging with patient contact", accent: "#547f92", schedule: 70,
    signals: { social: 55, physical: 70, pressure: 60, analytical: 55, people: 72, technical: 70 },
    strengths: ["Imaging equipment", "Technical accuracy", "Patient communication"],
    summary: "A diagnostic-imaging career combining technical equipment, clinical procedures and direct patient support.",
  },
  occupationalTherapist: {
    id: "occupationalTherapist", shortTitle: "Occupational Therapist", group: "Healthcare", kicker: "Helping people regain everyday function", accent: "#6a8f78", schedule: 85,
    signals: { social: 85, physical: 55, pressure: 55, analytical: 70, people: 94, technical: 45 },
    strengths: ["Active listening", "Treatment planning", "Social perceptiveness"],
    summary: "A rehabilitation career helping people participate more fully in daily, school and working life.",
  },
  physiotherapist: {
    id: "physiotherapist", shortTitle: "Physiotherapist", group: "Healthcare", kicker: "Movement, rehabilitation and hands-on care", accent: "#4f8d84", schedule: 80,
    signals: { social: 88, physical: 75, pressure: 50, analytical: 65, people: 95, technical: 42 },
    strengths: ["Assessment", "Treatment planning", "Patient education"],
    summary: "A rehabilitation career focused on movement, physical function, injury recovery and prevention.",
  },
  hvac: {
    id: "hvac", shortTitle: "HVAC Technician", group: "Skilled trades", kicker: "Climate systems and mechanical fault-finding", accent: "#b77835", schedule: 55,
    signals: { social: 40, physical: 85, pressure: 60, analytical: 55, people: 35, technical: 70 },
    strengths: ["Troubleshooting", "Installation", "Equipment maintenance"],
    summary: "A skilled trade installing and maintaining heating, ventilation, air-conditioning and refrigeration systems.",
  },
  welder: {
    id: "welder", shortTitle: "Welder", group: "Skilled trades", kicker: "Precision fabrication in demanding environments", accent: "#a45f42", schedule: 65,
    signals: { social: 25, physical: 90, pressure: 55, analytical: 40, people: 20, technical: 65 },
    strengths: ["Fabrication", "Quality control", "Equipment operation"],
    summary: "A fabrication trade joining and cutting metal with close attention to precision, safety and specifications.",
  },
  carpenter: {
    id: "carpenter", shortTitle: "Carpenter", group: "Skilled trades", kicker: "Building structures through measured craft", accent: "#9b7047", schedule: 60,
    signals: { social: 35, physical: 88, pressure: 55, analytical: 45, people: 30, technical: 55 },
    strengths: ["Construction", "Measurement", "Material handling"],
    summary: "A construction trade building, installing and repairing structural and finished components.",
  },
  automotiveTech: {
    id: "automotiveTech", shortTitle: "Automotive Technician", group: "Skilled trades", kicker: "Vehicle diagnosis, electronics and repair", accent: "#5f7182", schedule: 70,
    signals: { social: 45, physical: 80, pressure: 62, analytical: 60, people: 40, technical: 75 },
    strengths: ["Diagnostics", "Repairing", "Electronic systems"],
    summary: "A technical trade diagnosing, servicing and repairing mechanical and electronic vehicle systems.",
  },
  financialAnalyst: {
    id: "financialAnalyst", shortTitle: "Financial Analyst", group: "Business & finance", kicker: "Markets, models and evidence-based decisions", accent: "#655b8f", schedule: 90,
    signals: { social: 50, physical: 10, pressure: 55, analytical: 85, people: 45, technical: 60 },
    strengths: ["Financial modelling", "Critical thinking", "Data interpretation"],
    summary: "An analytical finance career evaluating performance, investments, risk and business decisions.",
  },
  systemsAnalyst: {
    id: "systemsAnalyst", shortTitle: "Systems Analyst", group: "Technology", kicker: "Turning business needs into workable systems", accent: "#426f7f", schedule: 92,
    signals: { social: 55, physical: 10, pressure: 45, analytical: 82, people: 50, technical: 85 },
    strengths: ["Systems analysis", "Requirements discovery", "Problem-solving"],
    summary: "A technology career analysing organisational needs and designing improvements to information systems.",
  },
};

const priorityOrder: PriorityKey[] = ["pay", "momentum", "entry", "physical", "people", "schedule"];
const priorityCopy: Record<PriorityKey, { label: string; note: string }> = {
  pay: { label: "Higher pay", note: "Annual median earnings" },
  momentum: { label: "Market signal", note: "Best comparable local trend available" },
  entry: { label: "Shorter entry path", note: "Relative education and credential effort" },
  physical: { label: "Lower physical demand", note: "Less movement and hands-on activity" },
  people: { label: "People contact", note: "Helping, service and relationship work" },
  schedule: { label: "Schedule consistency", note: "More regular work scheduling" },
};
const entryEase: Record<CareerId, number> = {
  rn: 30,
  software: 42,
  electrician: 66,
  accountant: 42,
  dental: 52,
  sonographer: 42,
  plumber: 68,
  designer: 55,
  security: 40,
  teacher: 28,
  enrolledNurse: 65,
  radiologicTech: 45,
  occupationalTherapist: 28,
  physiotherapist: 25,
  hvac: 70,
  welder: 75,
  carpenter: 72,
  automotiveTech: 70,
  financialAnalyst: 40,
  systemsAnalyst: 45,
};
const initialPriorities: PriorityWeights = { pay: 4, momentum: 3, entry: 2, physical: 2, people: 2, schedule: 2 };

export const pairScores: Record<
  string,
  { overall: number; skills: number; interests: number; context: number; education: number | null }
> = {
  "accountant|dental": { overall: 47.0, skills: 56.7, interests: 51.3, context: 48.3, education: null },
  "accountant|designer": { overall: 52.4, skills: 68.1, interests: 51.5, context: 66.7, education: null },
  "accountant|electrician": { overall: 44.2, skills: 52.9, interests: 43.5, context: 34.8, education: null },
  "accountant|plumber": { overall: 40.3, skills: 52.3, interests: 35.0, context: 36.9, education: null },
  "accountant|rn": { overall: 50.7, skills: 61.7, interests: 60.3, context: 53.4, education: null },
  "accountant|security": { overall: 59.5, skills: 62.6, interests: 76.2, context: 67.1, education: null },
  "accountant|software": { overall: 54.7, skills: 60.5, interests: 62.5, context: 59.6, education: null },
  "accountant|sonographer": { overall: 47.3, skills: 56.8, interests: 53.9, context: 50.2, education: null },
  "accountant|teacher": { overall: 49.4, skills: 65.8, interests: 44.5, context: 51.8, education: null },
  "dental|designer": { overall: 48.9, skills: 62.5, interests: 52.1, context: 48.1, education: 83.7 },
  "dental|electrician": { overall: 50.4, skills: 59.2, interests: 57.0, context: 43.4, education: 83.5 },
  "dental|plumber": { overall: 49.5, skills: 62.9, interests: 50.4, context: 46.4, education: 83.1 },
  "dental|rn": { overall: 58.9, skills: 58.9, interests: 85.5, context: 57.6, education: 68.8 },
  "dental|security": { overall: 49.2, skills: 59.0, interests: 61.1, context: 52.8, education: 85.4 },
  "dental|software": { overall: 47.3, skills: 58.5, interests: 58.2, context: 44.7, education: 84.3 },
  "dental|sonographer": { overall: 67.4, skills: 71.9, interests: 81.6, context: 72.8, education: 96.5 },
  "dental|teacher": { overall: 51.2, skills: 53.3, interests: 60.9, context: 49.5, education: 86.2 },
  "designer|electrician": { overall: 44.7, skills: 51.8, interests: 51.0, context: 34.4, education: 76.6 },
  "designer|plumber": { overall: 44.0, skills: 51.7, interests: 39.5, context: 38.4, education: 76.5 },
  "designer|rn": { overall: 46.6, skills: 56.8, interests: 56.1, context: 47.0, education: 77.4 },
  "designer|security": { overall: 54.3, skills: 63.9, interests: 54.1, context: 66.6, education: 96.8 },
  "designer|software": { overall: 57.0, skills: 64.4, interests: 58.6, context: 67.7, education: 96.6 },
  "designer|sonographer": { overall: 48.8, skills: 58.5, interests: 50.3, context: 51.1, education: 85.4 },
  "designer|teacher": { overall: 55.4, skills: 60.2, interests: 70.4, context: 53.3, education: 95.2 },
  "electrician|plumber": { overall: 69.3, skills: 72.0, interests: 84.4, context: 76.3, education: 98.0 },
  "electrician|rn": { overall: 49.4, skills: 54.6, interests: 50.3, context: 51.3, education: 57.4 },
  "electrician|security": { overall: 47.9, skills: 62.2, interests: 51.9, context: 41.6, education: 74.2 },
  "electrician|software": { overall: 44.8, skills: 61.9, interests: 51.6, context: 28.1, education: 74.3 },
  "electrician|sonographer": { overall: 51.7, skills: 65.7, interests: 58.0, context: 46.1, education: 84.7 },
  "electrician|teacher": { overall: 42.3, skills: 47.3, interests: 41.9, context: 44.0, education: 71.9 },
  "plumber|rn": { overall: 43.7, skills: 49.7, interests: 41.6, context: 49.0, education: 57.0 },
  "plumber|security": { overall: 45.3, skills: 61.4, interests: 41.5, context: 45.5, education: 74.1 },
  "plumber|software": { overall: 44.1, skills: 63.5, interests: 41.2, context: 32.2, education: 74.2 },
  "plumber|sonographer": { overall: 50.8, skills: 61.4, interests: 50.2, context: 48.4, education: 84.3 },
  "plumber|teacher": { overall: 39.5, skills: 42.8, interests: 32.7, context: 46.3, education: 71.7 },
  "rn|security": { overall: 52.0, skills: 62.6, interests: 68.3, context: 53.2, education: 77.4 },
  "rn|software": { overall: 46.7, skills: 59.7, interests: 63.1, context: 41.9, education: 75.3 },
  "rn|sonographer": { overall: 63.6, skills: 67.4, interests: 77.3, context: 65.3, education: 71.8 },
  "rn|teacher": { overall: 59.4, skills: 72.3, interests: 65.2, context: 60.0, education: 76.0 },
  "security|software": { overall: 66.9, skills: 77.8, interests: 79.8, context: 63.4, education: 97.6 },
  "security|sonographer": { overall: 53.0, skills: 62.1, interests: 67.5, context: 53.7, education: 84.6 },
  "security|teacher": { overall: 50.6, skills: 57.2, interests: 47.7, context: 61.4, education: 96.9 },
  "software|sonographer": { overall: 49.0, skills: 59.2, interests: 65.7, context: 45.4, education: 83.4 },
  "software|teacher": { overall: 48.2, skills: 53.4, interests: 50.2, context: 47.9, education: 97.5 },
  "sonographer|teacher": { overall: 53.3, skills: 58.1, interests: 53.5, context: 52.8, education: 84.0 },
};

export const signalLabels: Record<SignalKey, { label: string; note: string }> = {
  social: { label: "Social interaction", note: "contact, teamwork and public-facing work" },
  physical: { label: "Physical demand", note: "movement, posture and hands-on activity" },
  pressure: { label: "Pressure exposure", note: "time pressure, conflict and consequences" },
  analytical: { label: "Analytical content", note: "analysis, reasoning and problem-solving" },
  people: { label: "People-oriented", note: "helping, service and relationship work" },
  technical: { label: "Technical content", note: "technology, systems and troubleshooting" },
};

export const ids = Object.keys(careers) as CareerId[];

function pairKey(a: CareerId, b: CareerId) {
  return [a, b].sort().join("|");
}

function scaled(value: number, values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return 50;
  return ((value - min) / (max - min)) * 100;
}

function priorityLevel(value: number) {
  return ["Off", "Low", "Light", "Medium", "High", "Essential"][value];
}

function annualSalary(market: MarketView, country: CountryId) {
  return market.annualMedian === null ? "Not currently available" : money(market.annualMedian, country);
}

function mappingLabel(market: MarketView) {
  if (["BROADER", "BROAD"].includes(market.mappingQuality)) return "broader match";
  if (market.mappingQuality === "NO_EQUIVALENT") return "no direct equivalent";
  if (["APPROXIMATE", "PARTIAL", "REVIEW_REQUIRED", "MANUAL_REVIEW"].includes(market.mappingQuality)) return "approximate match";
  return "local occupation match";
}

function CareerPicker({
  label,
  value,
  other,
  country,
  allowedIds,
  onChange,
}: {
  label: string;
  value: CareerId;
  other: CareerId;
  country: CountryId;
  allowedIds?: CareerId[];
  onChange: (id: CareerId) => void;
}) {
  const career = careers[value];
  const market = getMarket(career.id, country);
  return (
    <label className="career-picker" style={{ "--career-accent": career.accent } as React.CSSProperties}>
      <span className="picker-label">{label}</span>
      <span className="picker-title">{career.shortTitle}</span>
      <span className="picker-meta">
        {career.group} · {classification(country)} {market.code}
        {market.localTitle !== career.shortTitle && <small>Mapped to {market.localTitle} ({mappingLabel(market)})</small>}
      </span>
      <select
        value={value}
        aria-label={label}
        onChange={(event) => onChange(event.target.value as CareerId)}
      >
        {Array.from(new Set(ids.map((id) => careers[id].group))).map((group) => (
          <optgroup key={group} label={group}>
            {ids.filter((id) => careers[id].group === group).map((id) => (
              <option key={id} value={id} disabled={id === other || (allowedIds ? !allowedIds.includes(id) : false)}>
                {careers[id].shortTitle}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <span className="select-cue" aria-hidden="true">Change ↓</span>
    </label>
  );
}

function MetricRow({
  label,
  a,
  b,
  higherWins = true,
}: {
  label: string;
  a: string;
  b: string;
  higherWins?: boolean;
}) {
  return (
    <div className="metric-row" role="row">
      <strong role="cell">{a}</strong>
      <span role="rowheader">{label}</span>
      <strong role="cell">{b}</strong>
      {!higherWins && <i className="context-note">trade-off</i>}
    </div>
  );
}

export type PathGraphExperienceProps = {
  initialLeftId?: CareerId;
  initialRightId?: CareerId;
  initialCountry?: CountryId;
  pageMode?: "home" | "comparison";
};

export function PathGraphExperience({
  initialLeftId = "rn",
  initialRightId = "software",
  initialCountry = "us",
  pageMode = "home",
}: PathGraphExperienceProps) {
  const [leftId, setLeftId] = useState<CareerId>(initialLeftId);
  const [rightId, setRightId] = useState<CareerId>(initialRightId);
  const [activeSignal, setActiveSignal] = useState<SignalKey | null>(null);
  const [countryOverride, setCountry] = useState<CountryId | null>(null);
  const [priorities, setPriorities] = useState<PriorityWeights>(initialPriorities);
  const locationSearch = useSyncExternalStore(
    () => () => undefined,
    () => window.location.search,
    () => "",
  );
  const requestedCountry = new URLSearchParams(locationSearch).get("country") as CountryId | null;
  const country = countryOverride ?? (requestedCountry && countries.some((item) => item.id === requestedCountry) ? requestedCountry : initialCountry);

  const left = careers[leftId];
  const right = careers[rightId];
  const leftMarket = getMarket(left.id, country);
  const rightMarket = getMarket(right.id, country);
  const pair = pairScores[pairKey(leftId, rightId)] ?? null;
  const selectedCountry = getCountry(country);
  const comparisonRows = getComparisonRows(leftMarket, rightMarket, country);
  const demandVerdict = getDemandVerdict(leftMarket, rightMarket, country);
  const approvedComparison = comparisonForKeys(leftId, rightId);
  const related = approvedComparison ? relatedComparisons(approvedComparison, 6) : [];

  const verdicts = (() => {
    const higherPay = leftMarket.annualMedian === null && rightMarket.annualMedian === null
      ? null
      : leftMarket.annualMedian === null
        ? right
        : rightMarket.annualMedian === null || leftMarket.annualMedian >= rightMarket.annualMedian
          ? left
          : right;
    const strongerDemand = demandVerdict.winner === "right" ? right : left;
    const lowerPhysical = left.signals.physical <= right.signals.physical ? left : right;
    return { higherPay, strongerDemand, lowerPhysical };
  })();

  const priorityResult = (() => {
    const universe = ids.map((id) => ({ career: careers[id], market: getMarket(id, country) }));
    const payValues = universe.flatMap(({ market }) => market.annualMedian === null ? [] : [market.annualMedian]);
    const momentumValues = universe.map(({ market }) => market.momentum);

    function profile(id: CareerId) {
      const career = careers[id];
      const market = getMarket(id, country);
      return {
        pay: market.annualMedian === null || payValues.length === 0 ? 50 : scaled(market.annualMedian, payValues),
        momentum: market.momentumAvailable ? scaled(market.momentum, momentumValues) : 50,
        entry: entryEase[id],
        physical: 100 - career.signals.physical,
        people: career.signals.people,
        schedule: career.schedule ?? 50,
      } satisfies Record<PriorityKey, number>;
    }

    function weightedScore(profileScores: Record<PriorityKey, number>) {
      const totalWeight = priorityOrder.reduce((sum, key) => sum + priorities[key], 0);
      if (!totalWeight) return 50;
      return priorityOrder.reduce((sum, key) => sum + profileScores[key] * priorities[key], 0) / totalWeight;
    }

    const leftProfile = profile(leftId);
    const rightProfile = profile(rightId);
    const leftScore = Math.round(weightedScore(leftProfile));
    const rightScore = Math.round(weightedScore(rightProfile));
    const winnerId = leftScore >= rightScore ? leftId : rightId;
    const winnerProfile = winnerId === leftId ? leftProfile : rightProfile;
    const otherProfile = winnerId === leftId ? rightProfile : leftProfile;
    const reason = [...priorityOrder]
      .filter((key) => priorities[key] > 0)
      .sort((a, b) => priorities[b] * (winnerProfile[b] - otherProfile[b]) - priorities[a] * (winnerProfile[a] - otherProfile[a]))[0] ?? "pay";

    return { leftScore, rightScore, winnerId, reason, gap: Math.abs(leftScore - rightScore) };
  })();

  function swap() {
    setLeftId(rightId);
    setRightId(leftId);
  }

  function queryWithCountry(nextCountry: CountryId) {
    const params = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
    params.set("country", nextCountry);
    return params.size ? `?${params}` : "";
  }

  function changeCountry(nextCountry: CountryId) {
    trackEvent("country_change", {
      previous_country: country,
      selected_country: nextCountry,
      page_type: pageMode,
      careers: `${leftId}|${rightId}`,
    });
    setCountry(nextCountry);
    if (pageMode === "comparison") {
      window.history.replaceState({}, "", `${window.location.pathname}${queryWithCountry(nextCountry)}`);
    }
  }

  function changeCareer(side: "left" | "right", id: CareerId) {
    const nextLeft = side === "left" ? id : leftId;
    const nextRight = side === "right" ? id : rightId;
    if (nextLeft === nextRight) return;
    if (pageMode === "comparison") {
      const approved = comparisonForKeys(nextLeft, nextRight);
      if (!approved) return;
      setLeftId(nextLeft);
      setRightId(nextRight);
      trackEvent("career_navigation", { page_type: "comparison", careers: `${nextLeft}|${nextRight}`, destination: approved.slug });
      window.location.assign(sitePath(`${comparisonPath(canonicalCareers[nextLeft].id, canonicalCareers[nextRight].id)}${queryWithCountry(country)}`));
      return;
    }
    if (side === "left") setLeftId(id);
    else setRightId(id);
  }

  const allowedLeftIds = pageMode === "comparison" ? ids.filter((id) => id !== rightId && comparisonForKeys(id, rightId)) : undefined;
  const allowedRightIds = pageMode === "comparison" ? ids.filter((id) => id !== leftId && comparisonForKeys(leftId, id)) : undefined;

  return (
    <main>
      <SiteHeader />

      <section className={`hero ${pageMode === "comparison" ? "comparison-route-hero" : ""}`} id="top">
        <div className="hero-copy">
          {pageMode === "comparison" && <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare careers", href: "/compare" }, { label: `${left.shortTitle} vs ${right.shortTitle}` }]} />}
          <p className="eyebrow">{pageMode === "comparison" ? `${selectedCountry.label} career comparison` : "Career decisions, made visible"}</p>
          <h1>{pageMode === "comparison" ? <>{left.shortTitle}<br /><em>vs {right.shortTitle}</em></> : <>Compare the work.<br /><em>Not just the salary.</em></>}</h1>
          <p className="hero-lede">
            {pageMode === "comparison"
              ? `Compare ${left.shortTitle} and ${right.shortTitle} across pay, local market signals, work characteristics and entry requirements.`
              : "PathGraph turns official career data into clear trade-offs—pay, opportunity, work environment, skills and the reality of changing paths."}
          </p>
          <div className="trust-line">
            {selectedCountry.trustSignals.map((signal) => <span key={signal}>{signal}</span>)}
          </div>
        </div>
        <div className="hero-note" aria-hidden="true">
          <span className="note-number">20</span>
          <span>careers available to compare</span>
          <div className="thread"><i /><i /><i /><i /></div>
        </div>
      </section>

      <section className="compare-shell" id="compare">
        <div className="country-control">
          <div>
            <p className="section-kicker">Labour market</p>
            <strong>{selectedCountry.label}</strong>
          </div>
          <label className="country-search">
            <span>Choose a country</span>
            <select
              value={country}
              onChange={(event) => changeCountry(event.target.value as CountryId)}
              aria-label="Choose a country"
            >
              {countries.map((item) => <option key={item.id} value={item.id}>{item.shortLabel}</option>)}
            </select>
            <i aria-hidden="true">⌄</i>
          </label>
        </div>

        <div className="compare-intro">
          <div>
            <p className="section-kicker">Build your comparison</p>
            <h2>Which path fits your priorities?</h2>
          </div>
          <p>Pick any two. Every number below updates instantly.</p>
        </div>

        <div className="picker-grid">
          <CareerPicker label="Career A" value={leftId} other={rightId} country={country} allowedIds={allowedLeftIds} onChange={(id) => changeCareer("left", id)} />
          <button className="swap-button" type="button" onClick={swap} aria-label="Swap careers">⇄</button>
          <CareerPicker label="Career B" value={rightId} other={leftId} country={country} allowedIds={allowedRightIds} onChange={(id) => changeCareer("right", id)} />
        </div>

        <div className="comparison-head">
          <article style={{ "--career-accent": left.accent } as React.CSSProperties}>
            <span className="career-index">A</span>
            <p>{left.kicker}</p>
            <h3>{left.shortTitle}</h3>
            <strong>{annualSalary(leftMarket, country)}</strong>
            <small>{leftMarket.headlineLabel}</small>
          </article>
          <div className="overlap-seal">
            <span>PathGraph</span>
            <strong>{pair?.overall ?? "—"}</strong>
            <small>{pair ? "experimental similarity" : "choose two careers"}</small>
          </div>
          <article style={{ "--career-accent": right.accent } as React.CSSProperties}>
            <span className="career-index">B</span>
            <p>{right.kicker}</p>
            <h3>{right.shortTitle}</h3>
            <strong>{annualSalary(rightMarket, country)}</strong>
            <small>{rightMarket.headlineLabel}</small>
          </article>
        </div>

        <div className="quick-verdicts">
          <div><span>Higher median</span><strong>{verdicts.higherPay?.shortTitle ?? "Not available"}</strong></div>
          <div><span>{demandVerdict.label}</span><strong>{demandVerdict.message ?? verdicts.strongerDemand.shortTitle}</strong></div>
          <div><span>Lower physical-demand signal</span><strong>{verdicts.lowerPhysical.shortTitle}</strong></div>
        </div>

        <section className="priority-panel" aria-labelledby="priority-title">
          <div className="priority-heading">
            <div>
              <p className="section-kicker">Exploration tool</p>
              <h2 id="priority-title">What matters to you?</h2>
              <p>Move the controls from off to essential. PathGraph recalculates the fit without hiding the trade-offs.</p>
              <p className="model-disclosure">Fit and similarity scores are experimental PathGraph calculations, not official labour-market statistics or career recommendations.</p>
            </div>
            <button type="button" onClick={() => setPriorities({ ...initialPriorities })}>Reset priorities</button>
          </div>

          <div className="priority-result" aria-live="polite">
            <article style={{ "--career-accent": left.accent, "--fit": `${priorityResult.leftScore}%` } as React.CSSProperties}>
              <span>{left.shortTitle}</span>
              <strong>{priorityResult.leftScore}<small>/100</small></strong>
              <i><b /></i>
            </article>
            <div className="priority-verdict">
              <span>Your current mix</span>
              <strong>{priorityResult.gap <= 3 ? "A genuinely close call" : `${careers[priorityResult.winnerId].shortTitle} leads by ${priorityResult.gap}`}</strong>
              <p>{priorityResult.gap <= 3 ? "Change one or two priorities to see what breaks the tie." : `Its strongest weighted advantage here is ${priorityCopy[priorityResult.reason].label.toLowerCase()}.`}</p>
            </div>
            <article style={{ "--career-accent": right.accent, "--fit": `${priorityResult.rightScore}%` } as React.CSSProperties}>
              <span>{right.shortTitle}</span>
              <strong>{priorityResult.rightScore}<small>/100</small></strong>
              <i><b /></i>
            </article>
          </div>

          <div className="priority-controls">
            {priorityOrder.map((key) => (
              <label key={key} className={priorities[key] === 0 ? "is-off" : ""}>
                <span><strong>{priorityCopy[key].label}</strong><small>{priorityCopy[key].note}</small></span>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={priorities[key]}
                  onChange={(event) => setPriorities((current) => ({ ...current, [key]: Number(event.target.value) }))}
                  onPointerUp={() => trackEvent("comparison_interaction", { page_type: pageMode, careers: `${leftId}|${rightId}`, control: key })}
                  onKeyUp={() => trackEvent("comparison_interaction", { page_type: pageMode, careers: `${leftId}|${rightId}`, control: key })}
                  aria-label={`${priorityCopy[key].label} importance`}
                />
                <b>{priorityLevel(priorities[key])}</b>
              </label>
            ))}
          </div>
          <p className="priority-method-note">
            {selectedCountry.capabilities.outlook.note} Market momentum uses the country registry’s declared signal and stays neutral when none is available. {" "}
            Entry-path scoring is a transparent editorial band used by this exploration tool, based on the typical education and credential route shown below.
          </p>
        </section>

        <section className="data-panel">
          <div className="panel-heading">
            <span>01</span>
            <div><p className="section-kicker">At a glance</p><h2>Money, demand and entry</h2></div>
          </div>
          <div className="metric-table" role="table" aria-label="Career facts">
            <div className="metric-row metric-header" role="row"><div role="columnheader">{left.shortTitle}</div><div role="columnheader">{selectedCountry.label} data</div><div role="columnheader">{right.shortTitle}</div></div>
            {comparisonRows.map((row) => <MetricRow key={row.key} label={row.label} a={row.a} b={row.b} higherWins={row.higherWins} />)}
          </div>
          <p className="data-source-note">{selectedCountry.sourceNote}</p>
        </section>

        <section className="signals-panel">
          <div className="panel-heading light">
            <span>02</span>
            <div><p className="section-kicker">Beyond job titles</p><h2>What the work may feel like</h2></div>
          </div>
          <p className="signals-intro">
            These are occupation percentiles—not ratings of whether a career is good or bad.
            Select a signal to understand what it contains. {selectedCountry.workSignalNote}
          </p>
          <div className="signals-list">
            {(Object.keys(signalLabels) as SignalKey[]).map((key) => {
              const label = signalLabels[key];
              return (
                <button
                  className={`signal-row ${activeSignal === key ? "active" : ""}`}
                  key={key}
                  type="button"
                  onClick={() => setActiveSignal(activeSignal === key ? null : key)}
                  aria-expanded={activeSignal === key}
                >
                  <span className="signal-value left-value">{left.signals[key].toFixed(0)}</span>
                  <span className="signal-track">
                    <i className="left-bar" style={{ width: `${left.signals[key] / 2}%`, background: left.accent }} />
                    <i className="right-bar" style={{ width: `${right.signals[key] / 2}%`, background: right.accent }} />
                  </span>
                  <span className="signal-value">{right.signals[key].toFixed(0)}</span>
                  <span className="signal-label"><strong>{label.label}</strong><small>{activeSignal === key ? label.note : "View meaning"}</small></span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="overlap-panel">
          <div className="panel-heading">
            <span>03</span>
            <div><p className="section-kicker">Shared foundations</p><h2>Similar doesn’t mean interchangeable</h2></div>
          </div>
          {pair ? (
            <div className="overlap-grid">
              <div className="overlap-score-card">
                <div className="big-score">{pair.overall}<small>/100</small></div>
                <p>Experimental model similarity</p>
                <span>A PathGraph calculation across skills, interests, work context and education signals. It is not an official statistic or a measure of transition feasibility.</span>
              </div>
              <div className="domain-scores">
                {[
                  ["Skills", pair.skills],
                  ["Interests", pair.interests],
                  ["Work context", pair.context],
                  ["Education", pair.education],
                ].map(([label, score]) => (
                  <div key={label as string}>
                    <span>{label}</span>
                    <i><b style={{ width: `${score ?? 0}%` }} /></i>
                    <strong>{score === null ? "n/a" : score}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="empty-state">Choose two different careers to view their experimental similarity.</p>}
          <div className="foundation-grid">
            <article style={{ "--career-accent": left.accent } as React.CSSProperties}>
              <p>{left.shortTitle} foundations</p>
              <ul>{left.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article style={{ "--career-accent": right.accent } as React.CSSProperties}>
              <p>{right.shortTitle} foundations</p>
              <ul>{right.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>
        </section>

        <section className="reality-panel">
          <p className="section-kicker">Transition reality check</p>
          <h2>A shared foundation is not a shortcut.</h2>
          <div>
            <p>
              PathGraph separates occupational similarity from transition feasibility.
              Licensure, apprenticeships, formal education and missing technical knowledge
              still matter—even when two careers share useful skills.
            </p>
            <button type="button" onClick={() => document.getElementById("method")?.scrollIntoView({ behavior: "smooth" })}>
              See how scores work <span>→</span>
            </button>
          </div>
        </section>
      </section>

      {pageMode === "comparison" && approvedComparison && (
        <section className="route-content comparison-link-section">
          <div className="route-section-heading"><p className="section-kicker">Keep exploring</p><h2>Profiles and related comparisons</h2></div>
          <div className="profile-link-pair">
            {[leftId, rightId].map((id) => <Link key={id} href={`/careers/${canonicalCareers[id].id}?country=${country}`} prefetch={false}><span>Career profile</span><strong>{careers[id].shortTitle}</strong><i>View local facts →</i></Link>)}
          </div>
          <div className="related-grid comparison-related-grid">
            {related.map((item) => <Link key={item.slug} href={`${comparisonPath(canonicalCareers[item.left].id, canonicalCareers[item.right].id)}?country=${country}`} prefetch={false}><span>{item.reason}</span><strong>{careers[item.left].shortTitle} vs {careers[item.right].shortTitle}</strong><i>Open comparison →</i></Link>)}
          </div>
        </section>
      )}

      <section className="career-library" id="careers">
        <div className="library-heading">
          <p className="section-kicker">Career library</p>
          <h2>Twenty careers. Seventy-six approved comparisons.</h2>
          <p>A quality-gated universe spanning healthcare, technology, trades, finance, design and education.</p>
        </div>
        <div className="career-card-grid">
          {ids.map((id, index) => {
            const career = careers[id];
            const market = getMarket(id, country);
            return (
              <Link
                className="career-card"
                key={id}
                href={`/careers/${canonicalCareers[id].id}${pageMode === "comparison" ? queryWithCountry(country) : ""}`}
                prefetch={false}
                style={{ "--career-accent": career.accent } as React.CSSProperties}
                onClick={() => trackEvent("career_navigation", { page_type: pageMode, career: id, destination: canonicalCareers[id].id })}
              >
                <span>{String(index + 1).padStart(2, "0")} · {career.group}</span>
                <h3>{career.shortTitle}</h3>
                <p>{career.summary}</p>
                <strong>{market.annualMedian === null ? "Salary not currently available" : `${money(market.annualMedian, country)} / year`}</strong>
                <i>Explore this career →</i>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="method-section" id="method">
        <div>
          <p className="section-kicker">How PathGraph works</p>
          <h2>Facts first.<br />Calculations explained.</h2>
        </div>
        <ol>
          <li><span>1</span><div><strong>Official inputs</strong><p>{selectedCountry.methodNote}</p></div></li>
          <li><span>2</span><div><strong>Experimental comparison model</strong><p>Work descriptors become percentiles across covered occupations; model outputs are clearly separated from official inputs.</p></div></li>
          <li><span>3</span><div><strong>Visible trade-offs</strong><p>No magic “best career.” You see each factor and decide what matters.</p></div></li>
        </ol>
      </section>

      <SiteFooter marketLabel={selectedCountry.label} source={selectedCountry.footerSource} />
    </main>
  );
}

export default function Home() {
  return <PathGraphExperience />;
}
