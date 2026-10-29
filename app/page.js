import Portfolio from '../components/Portfolio';
import { getDb } from '../lib/db';

export const dynamic = 'force-dynamic';
export default async function HomePage() {
  let projects = [];
  try {
    const db = await getDb();
    projects = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray();
    projects = projects.map(p => ({ ...p, _id: p._id.toString(), createdAt: p.createdAt?.toISOString?.() || null }));
  } catch (error) {
    console.error('Could not load projects:', error.message);
  }
  return <Portfolio projects={projects} />;
}
