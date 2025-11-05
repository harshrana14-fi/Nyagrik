"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Eye, Download, LogOut, User, Home } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type CaseItem = {
  _id: string;
  title: string;
  description: string;
  analysis?: string;
  documents?: string[];
  assignedLawyerId?: string | { $oid: string } | null;
  hearingDetails?: {
    lastHearingDate?: string;
    lastHearingSummary?: string;
    nextHearingDate?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

type User = {
  _id: string;
  role: string;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
};

type TabId = "profile" | "upload" | "history" | "connect";
type CommTabId = TabId | "communicate";

const Input = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      value={value || ""}
      onChange={onChange}
      required
    />
  </div>
);

const ReadOnlyInput = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
      value={value || ""}
      readOnly
      disabled
    />
  </div>
);

export default function ClientDashboardPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [activeTab, setActiveTab] = useState<CommTabId>("profile");
  const [user, setUser] = useState<User | null>(null);
  const [caseHistory, setCaseHistory] = useState<CaseItem[]>([]);
  // removed expanded state (using modal now)
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiModalContent, setAiModalContent] = useState<string>("");
  const [editUser, setEditUser] = useState<User>({
    _id: "",
    role: "client",
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });
  const [lawyersById, setLawyersById] = useState<Record<string, { _id: string; name: string; email: string; phone?: string; profileImage?: string; specialization?: string }>>({});
  const [notesByCase, setNotesByCase] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        setUser(data);
        setEditUser({
          _id: data._id || "",
          role: "client",
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          profileImage: data.profileImage || "",
        });

        const historyRes = await fetch("/api/case/assigned", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: data.userId || data._id,
            role: "client",
          }),
        });
        const historyData = await historyRes.json();
        if (historyRes.ok) {
          setCaseHistory(historyData.cases);

          // Fetch assigned lawyers for these cases
          const cases: CaseItem[] = historyData.cases as CaseItem[];
          const lawyerIds = Array.from(new Set(cases.map((c) => c.assignedLawyerId).filter(Boolean))) as string[];
          if (lawyerIds.length) {
            try {
              const lr = await fetch("/api/user/list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: lawyerIds }),
              });
              const ldata = await lr.json();
              if (lr.ok && Array.isArray(ldata)) {
                const map: Record<string, { _id: string; name: string; email: string; phone?: string; profileImage?: string; specialization?: string }> = {};
                for (const u of ldata) map[u._id as string] = u;
                setLawyersById(map);
              }
            } catch {
              // ignore lawyer fetch errors
            }
          } else {
            setLawyersById({});
          }
        }
      } catch (err) {
        console.error("Error fetching user or history:", err);
        router.push("/login");
      }
    };

    checkAuthAndFetchUser();
  }, [router]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !description || !user?._id)
      return alert("Please upload a file and enter description");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, fileName: file.name }),
    });

    const data = await res.json();
    if (!data.success) return alert("AI analysis failed");

    const uploadRes = await fetch("/api/case/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: file.name,
        description,
        clientId: user._id,
        documents: [file.name],
        analysis: data.analysis,
      }),
    });

    const uploadData = await uploadRes.json();
    if (!uploadData.success) return alert("Case upload failed");

    // Fetch updated case list
    const historyRes = await fetch("/api/case/assigned", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        role: "client",
      }),
    });
    const historyData = await historyRes.json();
    if (historyRes.ok) {
      setCaseHistory(historyData.cases);
    }

    setAiResult(data.analysis);
    setFile(null);
    setDescription("");
  };

  const convertMarkdownLiteToHtml = (text: string) => {
    if (!text) return "";
    const lines = text.split(/\r?\n/);
    const html: string[] = [];
    let inList = false;
    const flushList = () => {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
    };
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList();
        html.push("<br/>");
        continue;
      }
      const hMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (hMatch) {
        flushList();
        const level = hMatch[1].length;
        const content = hMatch[2];
        html.push(`<h${level} class=\"mt-4 mb-2 font-semibold text-gray-800\">${content}</h${level}>`);
        continue;
      }
      if (/^[-*]\s+/.test(trimmed)) {
        if (!inList) {
          inList = true;
          html.push('<ul class="list-disc list-inside space-y-1">');
        }
        html.push(`<li>${trimmed.replace(/^[-*]\s+/, "")}</li>`);
        continue;
      }
      const bolded = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html.push(`<p class=\"text-gray-800 leading-relaxed\">${bolded}</p>`);
    }
    flushList();
    return html.join("\n");
  };

  const tabs: { id: CommTabId; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "upload", label: "AI Case Upload" },
    { id: "history", label: "Report History" },
    { id: "connect", label: "Connect with Lawyer/Intern" },
    { id: "communicate", label: "Communicate" },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditUser({ ...editUser, profileImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Include email for API query (required), but only send editable fields for update
      const updatedData = {
        _id: editUser._id,
        email: editUser.email, // Required for API to find the user
        role: "client",
        name: editUser.name,
        profileImage: editUser.profileImage,
      };

      const res = await fetch("/api/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated.updated);
        setEditUser(updated.updated);
        setShowEditModal(false);
        setShowDropdown(false);
        alert("Profile updated successfully!");
      } else {
        const error = await res.json();
        console.error("Update failed:", error);
        alert("Update failed: " + error.error);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Something went wrong.");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/login");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("Error logging out:", err);
      alert("Something went wrong during logout.");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-0">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm pt-8">
        <div className="max-w-7xl mx-auto px-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-700">Client Dashboard</h1>
          {user && (
            <div className="flex items-center gap-3 relative" ref={dropdownRef}>
              <Link href="/" className="text-indigo-700 hover:text-indigo-800 transition" title="Go to Homepage">
                <Home size={24} />
              </Link>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-sm shadow hover:ring-2 ring-indigo-300 transition cursor-pointer"
              >
                {user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span>{getInitials(user.name)}</span>
                )}
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[180px] z-50">
                  <button
                    onClick={() => {
                      setShowEditModal(true);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition"
                  >
                    <User size={16} />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Welcome Message */}
      {user && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <p className="text-gray-700 font-medium">
              Welcome back,{" "}
              <span className="font-semibold text-indigo-700">{user.name}</span>
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 justify-center mt-4 pt-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              tab.id === "connect"
                ? router.push("/Dashboard/client/lawyers")
                : setActiveTab(tab.id)
            }
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto p-6">
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <p>
              <strong>Name:</strong> {user?.name || "N/A"}
            </p>
            <p>
              <strong>Role:</strong> Client
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "Not provided"}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phone || "Not provided"}
            </p>
            {user?.profileImage && (
              <div className="mt-4">
                <Image
                  src={user.profileImage}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-indigo-500"
                />
              </div>
            )}

            {/* Assigned Lawyer Section */}
            {Object.keys(lawyersById).length > 0 && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">Assigned Lawyer</h3>
                <div className="space-y-4">
                  {Array.from(new Set(caseHistory.map((c) => c.assignedLawyerId).filter(Boolean))).map((lid) => {
                    const key = typeof lid === "string" ? lid : (lid as any).$oid || String(lid);
                    const lw = lawyersById[key];
                    if (!lw) return null;
                    const wa = lw.phone ? `https://wa.me/${String(lw.phone).replace(/\D/g, "")}` : null;
                    return (
                      <div key={key} className="flex items-start gap-4 p-4 rounded border">
                        {lw.profileImage ? (
                          <img src={lw.profileImage} alt="Lawyer" width={56} height={56} className="rounded-full object-cover" />
                        ) : (
                          <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold">
                            {(lw.name || "L").charAt(0)}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold">{lw.name}</p>
                          {lw.specialization && (
                            <p className="text-sm text-gray-600">Specialization: {lw.specialization}</p>
                          )}
                          <p className="text-sm text-gray-600">Email: {lw.email || "N/A"}</p>
                          <p className="text-sm text-gray-600">Phone: {lw.phone || "N/A"}</p>
                          <div className="mt-2">
                            {wa ? (
                              <a
                                href={wa}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
                              >
                                WhatsApp
                              </a>
                            ) : (
                              <button className="inline-block bg-gray-300 text-gray-600 px-3 py-1.5 rounded text-sm" disabled>
                                WhatsApp (no phone)
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "upload" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Upload New Case</h2>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="block w-full mb-4"
            />
            <textarea
              placeholder="Enter case description..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full p-2 border rounded mb-4"
            />
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-md"
            >
              <UploadCloud size={20} /> Submit Case
            </button>
            {aiResult && (
              <div className="mt-6 bg-white border rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-3">AI Case Summary</h3>
                <div
                  className="prose prose-sm max-w-none text-gray-900"
                  dangerouslySetInnerHTML={{ __html: convertMarkdownLiteToHtml(aiResult) }}
                />
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Report History</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200 text-sm">
                  <th className="p-2">Date</th>
                  <th className="p-2">File</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">AI Summary</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {caseHistory.map((item, index) => (
                  <tr key={index} className="border-t text-sm hover:bg-gray-50">
                    <td className="p-2 whitespace-nowrap">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {item.title || "N/A"}
                    </td>
                    <td className="p-2">
                      {item.description?.slice(0, 40) || "N/A"}...
                    </td>
                    <td className="p-2">
                      <button
                        className="text-indigo-600 underline"
                        onClick={() => {
                          setAiModalContent(item.analysis || "");
                          setShowAiModal(true);
                        }}
                      >
                        View AI Summary
                      </button>
                    </td>

                    <td className="p-2 flex gap-3 justify-center">
                      {item.documents?.[0] ? (
                        <>
                          <a
                            href={`/uploads/${item.documents[0]}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download
                              size={16}
                              className="text-blue-600 hover:text-blue-800"
                            />
                          </a>
                          <a
                            href={`/uploads/${item.documents[0]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye
                              size={16}
                              className="text-green-600 hover:text-green-800"
                            />
                          </a>
                          <Link
                            href={`/Dashboard/client/case/${item._id}`}
                            className="text-indigo-600 hover:text-indigo-800 underline text-xs px-2 py-1"
                          >
                            Court Details
                          </Link>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">No file</span>
                      )}
                    </td>
                  </tr>
                ))}
                {!caseHistory.length && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No cases uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}

        {activeTab === "communicate" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Communicate with Assigned Lawyer</h2>
            <p className="text-sm text-gray-600 mb-4">Share updates, ask questions, and schedule a meeting before your next hearing.</p>

            {caseHistory.filter((c) => !!c.assignedLawyerId).length === 0 && (
              <p className="text-gray-600">No cases have been assigned to a lawyer yet.</p>
            )}

            <div className="space-y-5">
              {caseHistory.filter((c) => !!c.assignedLawyerId).map((c) => {
                const key = typeof c.assignedLawyerId === "string" ? c.assignedLawyerId : (c.assignedLawyerId as any)?.$oid || String(c.assignedLawyerId);
                const lw = key ? lawyersById[key] : undefined;
                const wa = lw?.phone ? `https://wa.me/${String(lw.phone).replace(/\D/g, "")}` : null;
                const meetHref = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(
                  `Meeting: ${c.title || "Case Discussion"}`
                )}&details=${encodeURIComponent(
                  `Case ID: ${c._id}\nClient: ${user?.name || ""}\nDescription: ${c.description || ""}`
                )}`;
                return (
                  <div key={c._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {lw?.profileImage ? (
                          <img src={lw.profileImage} alt="Lawyer" width={48} height={48} className="rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                            {(lw?.name || "L").charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{lw?.name || "Assigned Lawyer"}</p>
                          {lw?.specialization && (
                            <p className="text-sm text-gray-600">Specialization: {lw.specialization}</p>
                          )}
                          <p className="text-sm text-gray-600">Email: {lw?.email || "N/A"}</p>
                          <p className="text-sm text-gray-600">Phone: {lw?.phone || "N/A"}</p>
                          {c?.assignedLawyerId && (c as any).hearingDetails?.nextHearingDate && (
                            <p className="text-xs text-gray-500 mt-1">Next hearing: {new Date((c as any).hearingDetails.nextHearingDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={meetHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                        >
                          Schedule Meet
                        </a>
                        {wa ? (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            WhatsApp
                          </a>
                        ) : (
                          <button className="px-3 py-2 bg-gray-300 text-gray-600 rounded text-sm" disabled>
                            WhatsApp (no phone)
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm text-gray-600 mb-1">Send additional case details or questions</label>
                      <textarea
                        rows={3}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Write a message for your lawyer..."
                        value={notesByCase[c._id] || ""}
                        onChange={(e) => setNotesByCase((prev) => ({ ...prev, [c._id]: e.target.value }))}
                      />
                      <div className="mt-2 text-right">
                        <button
                          className="px-3 py-2 bg-gray-800 text-white rounded text-sm hover:bg-black"
                          onClick={async () => {
                            const text = notesByCase[c._id]?.trim();
                            if (!text) return alert("Please enter a message.");
                            try {
                              const res = await fetch("/api/case/addNote", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ caseId: c._id, text }),
                              });
                              const data = await res.json();
                              if (!res.ok || !data.success) throw new Error(data.error || "Failed");
                              setNotesByCase((prev) => ({ ...prev, [c._id]: "" }));
                              alert("Message sent to your case file.");
                            } catch (err: unknown) {
                              alert(err instanceof Error ? err.message : "Unknown error");
                            }
                          }}
                        >
                          Send to Lawyer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && user && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-lg"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                  className="block w-full text-sm text-gray-700"
                />
                {editUser.profileImage && (
                  <Image
                    src={editUser.profileImage}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="h-24 w-24 mt-2 rounded-full object-cover border"
                  />
                )}
              </div>
              <Input
                label="Full Name"
                value={editUser.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
              />

              <ReadOnlyInput
                label="Email"
                value={editUser.email}
              />

              <ReadOnlyInput
                label="Phone"
                value={editUser.phone}
              />

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Summary Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAiModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-lg"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold">AI Case Summary</h2>
            <div
              className="prose prose-sm max-w-none text-gray-900"
              dangerouslySetInnerHTML={{ __html: convertMarkdownLiteToHtml(aiModalContent) }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
