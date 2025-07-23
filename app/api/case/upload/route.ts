import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("cases");

    const { title, description, clientId, documents, analysis } = await req.json();

    const result = await collection.insertOne({
      title,
      description,
      clientId: new ObjectId(clientId),
      documents,
      analysis, 
      assignedLawyerId: null,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, caseId: result.insertedId }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
  }
}
