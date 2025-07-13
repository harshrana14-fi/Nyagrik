// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../lib/mongodb';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    // Verify JWT token from cookie
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    // Parse input
    const body = await req.json();
    const description = body?.description;

    if (!description || typeof description !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid or missing description.' }, { status: 400 });
    }

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(
      `You are a legal expert. Please analyze the following legal case description:\n\n${description}`
    );
    const analysis = await result.response.text();

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db();
    await db.collection('reports').insertOne({
      userId,
      description,
      analysis,
      date: new Date(),
    });

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error('[Gemini API Error]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
