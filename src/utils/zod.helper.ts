import { z } from "zod";

export function createEnumSchema<T extends Record<string, string>>(
  constObj: T,
) {
  const values = Object.values(constObj) as [string, ...string[]]; // helps TS understand it's non-empty
  return z.enum(values);
}
