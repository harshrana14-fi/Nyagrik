import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();

    const db = (await clientPromise).db();
    const users = await db
      .collection("users")
      .find({ _id: { $in: ids.map((id: string) => new ObjectId(id)) } })
      .project({ fullName: 1 }) // return only names
      .toArray();

    return NextResponse.json(users);
  } catch (err) {
    console.error("[USER LIST API ERROR]", err);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
