// app/api/updateProfile/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("nyay");
    const collection = db.collection("lawyers");

    // Match lawyer by email (you can change to _id or session-based user later)
    await collection.updateOne(
      { email: body.email },
      { $set: body },
      { upsert: true }
    );

    return NextResponse.json(body, { status: 200 });
  } catch (err) {
    console.error("Mongo Error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
