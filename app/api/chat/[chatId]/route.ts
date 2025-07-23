import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request, { params }: { params: { chatId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const chat = await db.collection('chats').findOne({ _id: new ObjectId(params.chatId) });

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json({
      messages: chat.messages || [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      participants: chat.participants?.map((id: any) => id.toString()) || [],
    });
  } catch (error) {
    console.error('[CHAT GET ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
