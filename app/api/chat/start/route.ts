import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const { clientId, lawyerId } = await req.json();
  const db = await getDb();

  const existing = await db.collection("chats").findOne({
    participants: { $all: [new ObjectId(clientId), new ObjectId(lawyerId)] },
  });

  if (existing) {
    return NextResponse.json({ chatId: existing._id.toString() });
  }

  const result = await db.collection("chats").insertOne({
    participants: [new ObjectId(clientId), new ObjectId(lawyerId)],
    messages: [],
  });

  return NextResponse.json({ chatId: result.insertedId.toString() });
}
