import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { caseId, lawyerId } = await req.json();
    if (!caseId || !lawyerId) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const db = (await clientPromise).db();
    const collection = db.collection("cases");

    const res = await collection.updateOne(
      { _id: new ObjectId(caseId), assignedLawyerId: new ObjectId(lawyerId) },
      { $set: { assignedLawyerId: null, status: "open", updatedAt: new Date() } }
    );

    if (res.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Case not found or not assigned to this lawyer" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}


