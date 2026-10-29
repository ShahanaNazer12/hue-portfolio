import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { createSession, sessionCookieName } from '../../../../lib/auth';

function safeEqual(a, b) {
  const aa = Buffer.from(String(a)); const bb = Buffer.from(String(b));
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    if (!safeEqual(email.trim().toLowerCase(), process.env.ADMIN_EMAIL.trim().toLowerCase()) || !safeEqual(password, process.env.ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }
    const token = await createSession(process.env.ADMIN_EMAIL);
    const response = NextResponse.json({ message: 'Login successful.' });
    response.cookies.set(sessionCookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 });
    return response;
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Unable to log in.' }, { status: 500 }); }
}
