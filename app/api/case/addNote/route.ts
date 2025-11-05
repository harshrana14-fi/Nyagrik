import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { caseId, text } = await req.json();
    if (!caseId || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ success: false, error: "Missing or invalid fields" }, { status: 400 });
    }

    type Note = { by: string; text: string; at: Date };
    type CaseDoc = { _id: ObjectId; notes?: Note[]; updatedAt?: Date };

    const db = (await clientPromise).db();
    const collection = db.collection<CaseDoc>("cases");

    const result = await collection.updateOne(
      { _id: new ObjectId(caseId) },
      {
        $push: {
          notes: {
            by: "client",
            text: text.trim(),
            at: new Date(),
          },
        },
        $set: { updatedAt: new Date() },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}


