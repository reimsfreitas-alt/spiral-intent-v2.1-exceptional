import {createHash,randomUUID} from 'node:crypto';

export function canonical(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj).sort().map(k => `${JSON.stringify(k)}:${canonical(obj[k])}`).join(',')}}`;
}

export function sha256(value: unknown): string {
  return createHash('sha256').update(canonical(value)).digest('hex');
}

export function eventHash(event: Omit<import('./types').OSEvent,'hash'>): string {
  return sha256(event);
}

export function newId(): string { return randomUUID(); }
