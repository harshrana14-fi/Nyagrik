import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = new ObjectId(decoded.userId); // ✅ cast to ObjectId

    const db = (await clientPromise).db();

    const chats = await db
      .collection("chats")
      .find({ participants: { $in: [userId] } }) // ✅ proper match
      .toArray();

    return NextResponse.json({ chats });
  } catch (err) {
    console.error("[CHATS API ERROR]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
