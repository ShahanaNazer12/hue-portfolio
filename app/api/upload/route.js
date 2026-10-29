import { NextResponse } from 'next/server';
import { getAdminSession } from '../../../lib/auth';
import cloudinary from '../../../lib/cloudinary';

export const runtime = 'nodejs';
export async function POST(request) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Please log in.' }, { status: 401 });
  try {
    const form = await request.formData(); const file = form.get('file');
    if (!file || typeof file === 'string') return NextResponse.json({ error: 'Choose an image first.' }, { status: 400 });
    if (!file.type?.startsWith('image/')) return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Image must be 5 MB or smaller.' }, { status: 400 });
    const bytes = Buffer.from(await file.arrayBuffer());
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'hue-portfolio', resource_type: 'image' }, (error, uploaded) => error ? reject(error) : resolve(uploaded));
      stream.end(bytes);
    });
    return NextResponse.json({ imageUrl: result.secure_url });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Image upload failed. Check Cloudinary settings.' }, { status: 500 }); }
}
