import { Resend } from 'resend';

export async function sendEmail({ to, subject, html, replyTo }) {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is missing');
  if (!process.env.EMAIL_FROM) throw new Error('EMAIL_FROM is missing');
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM, to, subject, html, ...(replyTo ? { replyTo } : {})
  });
  if (error) throw new Error(error.message || 'Email provider rejected the message');
  return data;
}
