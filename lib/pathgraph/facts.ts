import type { Fact, FactStatus, MetricKey, Provenance } from "./model";

export const unavailable = (label: string, status: Exclude<FactStatus, "AVAILABLE"> = "NOT_AVAILABLE", note?: string): Fact<number | string> => ({
  status,
  value: null,
  label,
  note,
});

export const available = <T extends number | string>(
  label: string,
  value: T,
  unit: string,
  provenance: Provenance,
  extra: Partial<Fact<T>> = {},
): Fact<T> => ({ status: "AVAILABLE", label, value, unit, provenance, ...extra });

export const emptyFacts = (): Record<MetricKey, Fact<number | string>> => ({
  annualMedian: unavailable("Median annual earnings"),
  nativeMedian: unavailable("Native median earnings"),
  hourlyMedian: unavailable("Median hourly earnings"),
  range: unavailable("Published earnings range"),
  employment: unavailable("Current employment"),
  employmentChange: unavailable("Employment change"),
  earningsChange: unavailable("Annual earnings change"),
  projectedGrowth: unavailable("Projected growth"),
  annualOpenings: unavailable("Annual openings"),
  education: unavailable("Typical education"),
  credential: unavailable("Training / credential"),
});
