import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'portfolio_admin_session';
function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET must be at least 32 characters');
  return new TextEncoder().encode(secret);
}

export async function createSession(email) {
  return new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('8h').sign(secretKey());
}

export async function getAdminSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.role !== 'admin' || payload.email !== process.env.ADMIN_EMAIL) return null;
    return payload;
  } catch { return null; }
}

export const sessionCookieName = COOKIE_NAME;
