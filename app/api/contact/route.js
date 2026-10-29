
import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { cleanText, isValidEmail } from '../../../lib/validators';
import { sendEmail } from '../../../lib/email';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

export async function POST(request) {
  try {
    const body = await request.json();

    const name = cleanText(body.name, 100);
    const email = cleanText(body.email, 254);
    const message = cleanText(body.message, 3000);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please complete every field.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const db = await getDb();

    await db.collection('contactMessages').insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    await sendEmail({
      to: process.env.ADMIN_PUBLIC_EMAIL || process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      html: `
        <h2>New portfolio message</h2>
        <p><b>Name:</b> ${safeName}</p>
        <p><b>Email:</b> ${safeEmail}</p>
        <p><b>Message:</b></p>
        <p>${safeMessage}</p>
      `,
    });

    return NextResponse.json(
      { message: 'Thanks! Your message has been sent.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form failure:', error);

    return NextResponse.json(
      {
        error:
          'Could not send message. Please try again later.',
      },
      { status: 500 }
    );
  }
}
