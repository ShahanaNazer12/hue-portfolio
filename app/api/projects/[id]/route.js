import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '../../../../lib/db';
import { getAdminSession } from '../../../../lib/auth';
import { cleanText } from '../../../../lib/validators';

export async function PUT(request, { params }) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Please log in.' }, { status: 401 });
  if (!ObjectId.isValid(params.id)) return NextResponse.json({ error: 'Invalid project ID.' }, { status: 400 });
  try {
    const body = await request.json();
    const title = cleanText(body.title, 120), description = cleanText(body.description, 1200), imageUrl = cleanText(body.imageUrl, 1000), projectUrl = cleanText(body.projectUrl, 1000);
    if (!title || !description || !imageUrl) return NextResponse.json({ error: 'Title, description and photo are required.' }, { status: 400 });
    const result = await (await getDb()).collection('projects').updateOne({ _id: new ObjectId(params.id) }, { $set: { title, description, imageUrl, projectUrl, updatedAt: new Date() } });
    if (!result.matchedCount) return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    return NextResponse.json({ message: 'Project updated.' });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Could not update project.' }, { status: 500 }); }
}
export async function DELETE(request, { params }) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Please log in.' }, { status: 401 });
  if (!ObjectId.isValid(params.id)) return NextResponse.json({ error: 'Invalid project ID.' }, { status: 400 });
  try {
    const result = await (await getDb()).collection('projects').deleteOne({ _id: new ObjectId(params.id) });
    if (!result.deletedCount) return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    return NextResponse.json({ message: 'Project deleted.' });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Could not delete project.' }, { status: 500 }); }
}
