import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "bghs_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function sign(payload: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function createSessionCookieValue(): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionCookieValue(value: string | undefined): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [role, expiresStr, sig] = parts;
  const payload = `${role}.${expiresStr}`;
  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }
  if (!safeEqual(sig, expected)) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  return role === "admin";
}

export function checkPassword(candidate: string): boolean {
  const actual = process.env.ADMIN_PASSWORD;
  if (!actual || !candidate) return false;
  return safeEqual(candidate, actual);
}
