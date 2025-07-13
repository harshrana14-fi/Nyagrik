import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
<<<<<<< HEAD
=======

const JWT_SECRET = process.env.JWT_SECRET!;
>>>>>>> 0f802d0e38b8c488819d54c8f95ed221e988d32f

export async function POST(req: Request) {
  try {
    const { fullName, email, password, role } = await req.json();

<<<<<<< HEAD
    if (!fullName || !email || !password || !role) {
=======
    // ✅ Debug Log
    console.log('[REGISTER] Received:', { fullName, email, role });

    // 1. Validate required fields
    if (!fullName || !email || !password || !role) {
      console.warn('[REGISTER] Missing fields');
>>>>>>> 0f802d0e38b8c488819d54c8f95ed221e988d32f
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const client = await clientPromise;
<<<<<<< HEAD
    const db = client.db('Nyagrik');
    const users = db.collection('users');

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

=======
    const db = client.db('nyay');
    const users = db.collection('users');

    // 2. Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      console.warn('[REGISTER] User already exists:', email);
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // 3. Hash password
>>>>>>> 0f802d0e38b8c488819d54c8f95ed221e988d32f
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('[REGISTER] Password hashed');

<<<<<<< HEAD
=======
    // 4. Insert new user
>>>>>>> 0f802d0e38b8c488819d54c8f95ed221e988d32f
    const result = await users.insertOne({
      fullName,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    });

<<<<<<< HEAD
    const JWT_SECRET = process.env.JWT_SECRET!;
=======
    console.log('[REGISTER] User created:', result.insertedId);

    // 5. Create JWT
>>>>>>> 0f802d0e38b8c488819d54c8f95ed221e988d32f
    const token = jwt.sign(
      { userId: result.insertedId, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

<<<<<<< HEAD
    const response = NextResponse.json({ message: 'User registered', id: result.insertedId });
=======
    // 6. Send cookie + response
    const response = NextResponse.json({
      message: 'User registered successfully',
      id: result.insertedId,
      role,
    });

>>>>>>> 0f802d0e38b8c488819d54c8f95ed221e988d32f
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
<<<<<<< HEAD
  } catch (error: any) {
    console.error('[REGISTER API ERROR]', error.message || error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
=======
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
    console.error('[REGISTER API ERROR]', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
>>>>>>> 0f802d0e38b8c488819d54c8f95ed221e988d32f
  }
}
