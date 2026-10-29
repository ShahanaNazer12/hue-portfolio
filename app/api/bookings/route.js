
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

    const fullName = cleanText(body.fullName, 100);
    const email = cleanText(body.email, 254);
    const agenda = cleanText(body.agenda, 3000);
    const preferredDateTime = cleanText(
      body.preferredDateTime,
      40
    );

    // Validate required fields
    if (!fullName || !email || !agenda || !preferredDateTime) {
      return NextResponse.json(
        { error: 'Please complete every field.' },
        { status: 400 }
      );
    }

    // Validate email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Validate requested meeting date and time
    const requestedDate = new Date(preferredDateTime);

    if (Number.isNaN(requestedDate.getTime())) {
      return NextResponse.json(
        { error: 'Please choose a valid date and time.' },
        { status: 400 }
      );
    }

    if (requestedDate.getTime() < Date.now()) {
      return NextResponse.json(
        {
          error: 'Please choose a date and time in the future.',
        },
        { status: 400 }
      );
    }

    // Format the meeting time for emails
    const timeText =
      requestedDate.toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
      }) + ' (India time)';

    // Escape user input before including it in HTML emails
    const safeName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safeAgenda = escapeHtml(agenda).replace(/\n/g, '<br>');
    const safeTime = escapeHtml(timeText);

    // Connect to MongoDB
    const db = await getDb();

    // Save the booking request
    const insert = await db.collection('bookings').insertOne({
      fullName,
      email,
      preferredDateTime: requestedDate,
      agenda,
      status: 'requested',
      createdAt: new Date(),
    });

    // Send notification emails
    try {
      // Email to the portfolio administrator
      await sendEmail({
        to:
          process.env.ADMIN_PUBLIC_EMAIL ||
          process.env.ADMIN_EMAIL,
        replyTo: email,
        subject: `Portfolio meeting request from ${fullName}`,
        html: `
          <h2>New meeting request</h2>
          <p><b>Name:</b> ${safeName}</p>
          <p><b>Email:</b> ${safeEmail}</p>
          <p><b>Requested time:</b> ${safeTime}</p>
          <p><b>Agenda:</b><br>${safeAgenda}</p>
          <p>Booking reference: ${insert.insertedId}</p>
        `,
      });

      // Confirmation email to the visitor
      await sendEmail({
        to: email,
        subject: 'Thank you for your meeting request',
        html: `
          <p>Hi ${safeName},</p>
          <p>
            Thank you for reaching out and requesting a meeting.
          </p>
          <p><b>Your requested time:</b> ${safeTime}</p>
          <p>
            Your meeting is not confirmed yet. I'll follow up soon
            with confirmation and the meeting invite or link.
          </p>
          <p>Best regards,<br>Your Name</p>
        `,
      });
    } catch (mailError) {
      console.error('Booking email failure:', mailError);

      return NextResponse.json(
        {
          error:
            'Your request was saved, but email delivery failed. Please try again later or contact me directly.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        message:
          'Meeting request sent! Check your email for a thank-you message.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking request failure:', error);

    return NextResponse.json(
      {
        error:
          'Could not process the request. Check database and email configuration.',
      },
      { status: 500 }
    );
  }
}
