import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { fullName, email, password, role } = await req.json();

    console.log('[REGISTER] Received:', { fullName, email, role });

    // Validate input
    if (!fullName || !email || !password || !role) {
      console.warn('[REGISTER] Missing required fields');
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('Nyagrik'); // change back to 'nyay' if needed
    const users = db.collection('users');

    // Check for existing user
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      console.warn('[REGISTER] User already exists:', email);
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('[REGISTER] Password hashed');

    // Create user
    const result = await users.insertOne({
      fullName,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    });

    console.log('[REGISTER] User created:', result.insertedId);

    // Create JWT token
    const token = jwt.sign(
      { userId: result.insertedId, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Prepare response
    const response = NextResponse.json({
      message: 'User registered successfully',
      id: result.insertedId,
      role,
    });

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
    console.error('[REGISTER API ERROR]', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
