import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_req: NextRequest, context: unknown) {
  try {
    // Support both Next 14/15 param typing shapes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = (await (context as any)?.params)?.id as string | undefined;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const db = (await clientPromise).db();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      _id: user._id?.toString?.() || String(user._id),
      name: user.fullName || user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      profileImage: user.profileImage || "",
      role: user.role || "",
    });
  } catch (err) {
    console.error("[USER BY ID ERROR]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


