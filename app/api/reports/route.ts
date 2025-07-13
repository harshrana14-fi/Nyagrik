import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const client = await clientPromise;
    const db = client.db();

    const reports = await db.collection('reports')
      .find({ userId: decoded.userId })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(reports);
  } catch (error) {
    console.error('[FETCH REPORTS ERROR]', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
