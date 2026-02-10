// src/utils/queryParser.ts
import { QueryParams } from '../types/query.type';

export interface ParsedQuery {
  page?: number;
  size?: number;
  search?: string;
}

function toNumber(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;
  const s = String(value).trim();
  if (s === '') return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

export function parseQueryParams(q: QueryParams | Record<string, unknown> | undefined): ParsedQuery {
  if (!q) return {};
  const page = toNumber((q as any).page);
  const size = toNumber((q as any).size);
  const searchRaw = (q as any).search;
  const search = typeof searchRaw === 'string' ? searchRaw.trim() || undefined : undefined;

  return { page, size, search };
}
