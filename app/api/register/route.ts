import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, role } = body;

    // ✅ Debug Log
    console.log('[REGISTER] Received:', { fullName, email, role });

    // 1. Validate required fields
    if (!fullName || !email || !password || !role) {
      console.warn('[REGISTER] Missing fields');
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('nyay');
    const users = db.collection('users');

    // 2. Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      console.warn('[REGISTER] User already exists:', email);
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('[REGISTER] Password hashed');

    // 4. Insert new user
    const result = await users.insertOne({
      fullName,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    });

    console.log('[REGISTER] User created:', result.insertedId);

    // 5. Create JWT
    const token = jwt.sign(
      { userId: result.insertedId, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Send cookie + response
    const response = NextResponse.json({
      message: 'User registered successfully',
      id: result.insertedId,
      role,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
    console.error('[REGISTER API ERROR]', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
