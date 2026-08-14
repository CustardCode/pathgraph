import type { CountryAdapter, CountryId } from "../model";
import { auAdapter } from "./au";
import { caAdapter } from "./ca";
import { nzAdapter } from "./nz";
import { sgAdapter } from "./sg";
import { ukAdapter } from "./uk";
import { usAdapter } from "./us";

export const adapters: Record<CountryId, CountryAdapter> = {
  us: usAdapter,
  au: auAdapter,
  ca: caAdapter,
  uk: ukAdapter,
  nz: nzAdapter,
  sg: sgAdapter,
};
