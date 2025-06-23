import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, role } = body;

    // 1. Validate required fields
    if (!fullName || !email || !password || !role) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('nyay');
    const collection = db.collection('users');

    // 2. Check if user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert the user with hashed password
    const result = await collection.insertOne({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    return new Response(
      JSON.stringify({ message: 'User created successfully', id: result.insertedId }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[REGISTER API ERROR]', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
