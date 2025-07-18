// app/api/lawyers/route.ts
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

type MongoLawyer = {
  _id: ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  experience?: string;
  profileImage?: string;
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("nyay");
    const collection = db.collection("lawyers");

    const rawLawyers = await collection.find({}).toArray() as MongoLawyer[];

    const lawyers = rawLawyers.map((lawyer) => ({
      id: lawyer._id.toString(),
      name: lawyer.name || "Unnamed",
      specialization: lawyer.specialization?.split(",").map(s => s.trim())?.[0] || "General",
      experience: parseInt(lawyer.experience?.replace(/\D/g, "") || "0"),
      rating: 4.5,
      reviewCount: 0,
      acceptedCases: [],
      location: "India",
      languages: ["English", "Hindi"],
      consultationFee: 1000,
      responseTime: "1 hour",
      bio: "Experienced legal expert.",
      education: [],
      certifications: [],
      successRate: 90,
      casesHandled: 0,
      availability: "Available",
      phone: lawyer.phone || "",
      email: lawyer.email || "",
      priceRange: "Mid-range",
      image: lawyer.profileImage || ""
    }));

    return NextResponse.json(lawyers);
  } catch (err) {
    console.error("Error fetching lawyers:", err);
    return NextResponse.json({ error: "Failed to load lawyers" }, { status: 500 });
  }
}
