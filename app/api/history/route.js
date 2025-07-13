// ✅ /app/api/history/route.js (fetches history by userId stored as string)
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../lib/mongodb';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const client = await clientPromise;
    const db = client.db();

    // ✅ Query using string userId (no ObjectId casting)
    const reports = await db.collection('reports')
      .find({ userId: userId })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({ history: reports });
  } catch (err) {
    console.error('[FETCH HISTORY ERROR]', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
