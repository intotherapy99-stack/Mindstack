/**
 * Input validation utilities for API routes.
 */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Indian phone: 10 digits, optionally prefixed with +91
  return /^(\+91)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ""));
}

export function isValidAmount(value: unknown): value is number {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 && num <= 10_000_000; // Max 1 crore
}

export function isValidId(id: string): boolean {
  // cuid format: starts with c, alphanumeric, 24-30 chars
  return /^c[a-z0-9]{23,29}$/.test(id);
}

export function isValidMonth(month: string): { year: number; month: number } | null {
  const parts = month.split("-");
  if (parts.length !== 2) return null;
  const [year, m] = parts.map(Number);
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(m) ||
    m < 1 ||
    m > 12 ||
    year < 2000 ||
    year > 2100
  ) {
    return null;
  }
  return { year, month: m };
}

export function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

export function isValidPositiveInt(value: unknown): boolean {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
}

export function sanitizeString(str: string, maxLength = 5000): string {
  return str.slice(0, maxLength).trim();
}
