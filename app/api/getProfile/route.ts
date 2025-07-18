import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const client = await clientPromise;
    const db = client.db('nyay');
    const user = await db.collection('lawyers').findOne({ email });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('GetProfile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
