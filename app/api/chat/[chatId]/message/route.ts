import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  const { senderId, text } = await req.json();
  const db = await getDb();

  const result = await db.collection("chats").updateOne(
    { _id: new ObjectId(params.chatId) },
    {
      $push: {
        messages: {
          senderId: new ObjectId(senderId),
          text,
          timestamp: new Date(),
        },
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
