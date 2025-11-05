import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { caseId, hearingDetails } = await req.json();

    if (!caseId || !hearingDetails) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("nyay");
    const collection = db.collection("cases");

    // Update case with hearing details
    const result = await collection.updateOne(
      { _id: new ObjectId(caseId) },
      {
        $set: {
          hearingDetails: hearingDetails,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Case not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Hearing details updated successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unknown error" },
      { status: 500 }
    );
  }
}

