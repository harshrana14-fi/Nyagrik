import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("cases");

    const openCases = await collection
      .find({ status: "open", assignedLawyerId: null })
      .toArray();

    return NextResponse.json({ cases: openCases }, { status: 200 }); // <-- Wrap inside object
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
  }
}
