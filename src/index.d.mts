// Objectif : décrire les types de l’API métier publique.
import type { JevProvider } from "./jev.mjs";
export type LegalSection = { id: string; text: string; sourceId?: string };
export function diffSections(
  before?: LegalSection[],
  after?: LegalSection[],
): any[];
export function assessImpact(
  change: any,
  profile: Record<string, unknown>,
  provider: JevProvider,
  options?: { minConfidence?: number },
): Promise<any>;
export function analyzeVersions(
  before: LegalSection[],
  after: LegalSection[],
  profile: Record<string, unknown>,
  provider: JevProvider,
  options?: { minConfidence?: number },
): Promise<any[]>;
export function runCli(
  argv: string[],
  io?: { log(value: string): void },
): Promise<void>;
