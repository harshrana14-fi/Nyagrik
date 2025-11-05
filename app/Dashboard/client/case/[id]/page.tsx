"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type HearingDetails = {
  lastHearingDate?: string;
  lastHearingSummary?: string;
  nextHearingDate?: string;
  orders?: string[];
};

export default function ClientCaseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [hearingDetails, setHearingDetails] = useState<HearingDetails>({});

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await fetch(`/api/case/${caseId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load case");
        const c = data.case || {};
        setTitle(c.title || "Case Details");
        setDescription(c.description || "");
        setHearingDetails(c.hearingDetails || {});
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    if (caseId) fetchCase();
  }, [caseId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 text-red-700 px-4 py-3 rounded">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="text-indigo-600 hover:text-indigo-800 underline"
          >
            ← Back
          </button>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">{description}</p>

          <h2 className="text-xl font-semibold text-gray-800 mb-3">Court Hearing Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Last Hearing Date</p>
              <p className="font-medium text-gray-800">
                {hearingDetails.lastHearingDate
                  ? new Date(hearingDetails.lastHearingDate).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Next Hearing Date</p>
              <p className="font-medium text-gray-800">
                {hearingDetails.nextHearingDate
                  ? new Date(hearingDetails.nextHearingDate).toLocaleDateString()
                  : "Not scheduled"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Last Hearing Summary</p>
              <p className="font-medium text-gray-800 whitespace-pre-wrap">
                {hearingDetails.lastHearingSummary || "No summary added yet."}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Orders</p>
              {Array.isArray(hearingDetails.orders) && hearingDetails.orders.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {hearingDetails.orders.map((o, idx) => (
                    <li key={idx} className="text-gray-800">{o}</li>
                  ))}
                </ul>
              ) : (
                <p className="font-medium text-gray-800">No orders recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


