"use client";

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
  assignedLawyerId?: string | null;
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
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [user, setUser] = useState<User | null>(null);
  const [caseHistory, setCaseHistory] = useState<CaseItem[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [editUser, setEditUser] = useState<User>({
    _id: "",
    role: "client",
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });

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

  const tabs: { id: TabId; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "upload", label: "AI Case Upload" },
    { id: "history", label: "Report History" },
    { id: "connect", label: "Connect with Lawyer/Intern" },
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
              <div className="mt-6 bg-gray-100 p-4 rounded">
                <h3 className="font-semibold mb-2">AI Analysis:</h3>
                <p>{aiResult}</p>
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
                  <th className="p-2">AI Solution</th>
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
                    <td
                      className="p-2 text-indigo-600 underline cursor-pointer"
                      onClick={() =>
                        setExpandedIndex(expandedIndex === index ? null : index)
                      }
                    >
                      {expandedIndex === index
                        ? item.analysis
                        : (item.analysis?.slice(0, 50) || "N/A") + "..."}
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
    </div>
  );
}
