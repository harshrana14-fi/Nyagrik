import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const client = await clientPromise;
    // Use the same database and collection as login/register APIs
    const db = client.db('Nyagrik');
    const collection = db.collection('users');
    const user = await collection.findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      _id: decoded.userId,
      role: decoded.role,
      name: user.name || user.fullName || 'N/A',
      email: user.email || 'Not provided',
      phone: user.phone || '',
      profileImage: user.profileImage || '',
    });
  } catch (err) {
    console.error('[JWT VERIFY ERROR]', err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
