"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

type HearingDetails = {
  lastHearingDate?: string;
  lastHearingSummary?: string;
  nextHearingDate?: string;
  orders?: string[];
};

type CaseDoc = {
  _id: string;
  title?: string;
  description?: string;
  clientId?: string | { $oid: string };
  documents?: string[];
  status?: string;
  createdAt?: string;
  analysis?: string;
  hearingDetails?: HearingDetails;
};

type Client = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
};

const toId = (v: unknown) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyV: any = v;
  if (anyV.$oid) return anyV.$oid as string;
  if (typeof anyV.toString === "function") return anyV.toString();
  return String(v);
};

const mdToHtml = (text: string) => {
  if (!text) return "";
  const lines = text.split(/\r?\n/);
  const html: string[] = [];
  let inList = false;
  const flush = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };
  for (const ln of lines) {
    const t = ln.trim();
    if (!t) {
      flush();
      html.push("<br/>");
      continue;
    }
    const h = t.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flush();
      const lvl = h[1].length;
      html.push(`<h${lvl} class=\"mt-4 mb-2 font-semibold\">${h[2]}</h${lvl}>`);
      continue;
    }
    if (/^[-*]\s+/.test(t)) {
      if (!inList) {
        inList = true;
        html.push('<ul class="list-disc list-inside space-y-1">');
      }
      html.push(`<li>${t.replace(/^[-*]\s+/, "")}</li>`);
      continue;
    }
    html.push(`<p class=\"text-gray-800\">${t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`);
  }
  flush();
  return html.join("\n");
};

export default function LawyerCaseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caseDoc, setCaseDoc] = useState<CaseDoc | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  // compute links inline where needed

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`/api/case/${caseId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch case");
        const c: CaseDoc = data.case;
        setCaseDoc(c);
        const cid = toId(c.clientId);
        if (cid) {
          const ures = await fetch(`/api/user/${cid}`);
          const udata = await ures.json();
          if (ures.ok) setClient(udata);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    if (caseId) run();
  }, [caseId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!caseDoc) return null;

  const whatsappHref = client?.phone
    ? `https://wa.me/${client.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hello ${client.name || "Client"}, I am your assigned lawyer regarding case ${caseDoc.title || caseDoc._id}.`
      )}`
    : undefined;

  const meetHref = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(
    `Meeting: ${caseDoc.title || "Case Discussion"}`
  )}&details=${encodeURIComponent(
    `Case ID: ${caseDoc._id}\nClient: ${client?.name || ""}\nDescription: ${caseDoc.description || ""}`
  )}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button onClick={() => router.back()} className="text-indigo-600 underline mb-4">← Back</button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-semibold mb-2">{caseDoc.title || "Case Details"}</h1>
              <p className="text-sm text-gray-500 mb-4">ID: #{caseDoc._id}</p>
              <p className="text-gray-800 whitespace-pre-wrap">{caseDoc.description}</p>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Status:</span> <span className="font-medium">{caseDoc.status || "open"}</span></div>
                <div><span className="text-gray-500">Created:</span> <span className="font-medium">{caseDoc.createdAt ? new Date(caseDoc.createdAt).toLocaleString() : ""}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-3">AI Summary</h2>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: mdToHtml(caseDoc.analysis || "") }}
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-3">Court Hearing Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Last Hearing</p>
                  <p className="font-medium">{caseDoc.hearingDetails?.lastHearingDate ? new Date(caseDoc.hearingDetails.lastHearingDate).toLocaleDateString() : "Not available"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Next Hearing</p>
                  <p className="font-medium">{caseDoc.hearingDetails?.nextHearingDate ? new Date(caseDoc.hearingDetails.nextHearingDate).toLocaleDateString() : "Not scheduled"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500">Last Hearing Summary</p>
                  <p className="font-medium whitespace-pre-wrap">{caseDoc.hearingDetails?.lastHearingSummary || "No summary added"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500">Orders</p>
                  {caseDoc.hearingDetails?.orders?.length ? (
                    <ul className="list-disc list-inside">
                      {caseDoc.hearingDetails.orders.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-medium">No orders recorded</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-3">Client Information</h2>
              <div className="flex items-center gap-3 mb-3">
                {client?.profileImage ? (
                  <Image src={client.profileImage} alt="Client" width={48} height={48} className="rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                    {(client?.name || "C").charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium">{client?.name || "Client"}</p>
                  <p className="text-sm text-gray-600">{client?.email}</p>
                  {client?.phone && <p className="text-sm text-gray-600">{client.phone}</p>}
                </div>
              </div>

              <div className="space-x-2">
                <a
                  href={meetHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 text-sm"
                >
                  Schedule a Meet
                </a>
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
                  >
                    WhatsApp
                  </a>
                ) : (
                  <button className="inline-block bg-gray-300 text-gray-600 px-3 py-2 rounded text-sm" disabled>
                    WhatsApp (no phone)
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-3">Case Files</h2>
              {caseDoc.documents?.length ? (
                <ul className="list-disc list-inside space-y-1">
                  {caseDoc.documents.map((d, idx) => {
                    const href = /^https?:\/\//i.test(d) ? d : `/uploads/${d}`;
                    return (
                      <li key={idx}>
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
                          {d}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-600">No files attached</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


