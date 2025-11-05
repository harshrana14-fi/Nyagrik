import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface RawUser {
  _id: ObjectId;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  role?: string;
  specialization?: string;
}

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();

    const db = (await clientPromise).db();
    const objectIds: ObjectId[] = (ids as string[]).map((id: string) => new ObjectId(id));

    // Fetch from users collection
    const rawUsers = await db
      .collection<RawUser>("users")
      .find(
        { _id: { $in: objectIds } },
        { projection: { fullName: 1, name: 1, email: 1, phone: 1, profileImage: 1, role: 1, specialization: 1 } }
      )
      .toArray();

    // Find which ids are missing and try lawyers collection (legacy)
    const foundIds = new Set(rawUsers.map((u) => u._id.toString()));
    const missingObjectIds = objectIds.filter((oid: ObjectId) => !foundIds.has(oid.toString()));

    let rawLawyers: RawUser[] = [];
    if (missingObjectIds.length > 0) {
      rawLawyers = await db
        .collection<RawUser>("lawyers")
        .find(
          { _id: { $in: missingObjectIds } },
          { projection: { fullName: 1, name: 1, email: 1, phone: 1, profileImage: 1, role: 1, specialization: 1 } }
        )
        .toArray();
    }

    const combined: RawUser[] = [...rawUsers, ...rawLawyers];

    const users = combined.map((u) => ({
      _id: u._id?.toString?.() || String(u._id),
      name: u.fullName || u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      profileImage: u.profileImage || "",
      role: u.role || "",
      specialization: u.specialization || "",
    }));

    return NextResponse.json(users);
  } catch (err) {
    console.error("[USER LIST API ERROR]", err);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
