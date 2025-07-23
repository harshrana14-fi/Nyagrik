import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { caseId, lawyerId } = await req.json();

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("cases");

    const result = await collection.updateOne(
      { _id: new ObjectId(caseId) },
      {
        $set: {
          assignedLawyerId: new ObjectId(lawyerId),
          status: "in_progress",
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
  }
}
