import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { userId, role } = await req.json();

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("cases");

    const filter =
      role === "lawyer"
        ? { assignedLawyerId: new ObjectId(userId) }
        : { clientId: new ObjectId(userId) };

    const assignedCases = await collection.find(filter).toArray();

    return NextResponse.json({ success: true, cases: assignedCases }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
  }
}
