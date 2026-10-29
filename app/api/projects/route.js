import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '../../../lib/db';
import { getAdminSession } from '../../../lib/auth';
import { cleanText } from '../../../lib/validators';

export async function GET() {
  try {
    const db = await getDb();
    const projects = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(projects.map(p => ({ ...p, _id: p._id.toString(), createdAt: p.createdAt?.toISOString?.() || null })));
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Could not load projects.' }, { status: 500 }); }
}
export async function POST(request) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Please log in.' }, { status: 401 });
  try {
    const body = await request.json();
    const title = cleanText(body.title, 120); const description = cleanText(body.description, 1200);
    const imageUrl = cleanText(body.imageUrl, 1000); const projectUrl = cleanText(body.projectUrl, 1000);
    if (!title || !description || !imageUrl) return NextResponse.json({ error: 'Title, description and project photo are required.' }, { status: 400 });
    const doc = { title, description, imageUrl, projectUrl, createdAt: new Date(), updatedAt: new Date() };
    const result = await (await getDb()).collection('projects').insertOne(doc);
    return NextResponse.json({ ...doc, _id: result.insertedId.toString() }, { status: 201 });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Could not save project.' }, { status: 500 }); }
}
