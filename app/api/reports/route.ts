import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  role: string;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const client = await clientPromise;
    const db = client.db();

    const reports = await db.collection('reports')
      .find({ userId: decoded.userId })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(reports);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
    console.error('[FETCH REPORTS ERROR]', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
