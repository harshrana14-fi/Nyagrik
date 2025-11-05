import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_req: NextRequest, context: unknown) {
  try {
    // Next.js (v15) may pass params as a direct object or a Promise
    // Using a generic "unknown" context and resolving at runtime avoids type mismatch across versions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = (await (context as any)?.params)?.id as string | undefined;
    if (!id) {
      return NextResponse.json({ error: "Missing case id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("cases");

    const caseDoc = await collection.findOne({ _id: new ObjectId(id) });
    if (!caseDoc) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ case: caseDoc }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


