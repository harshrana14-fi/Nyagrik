import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.email || !body.role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("nyay");
    const collectionName = body.role === "lawyer" ? "lawyers" : "users";
    const collection = db.collection(collectionName);

    await collection.updateOne(
      { email: body.email },
      { $set: body },
      { upsert: true }
    );

    return NextResponse.json({ success: true, updated: body }, { status: 200 });

  } catch (err) {
    console.error("Mongo Error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
