"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {Scale,FileText,Users,Calendar,MessageSquare,TrendingUp,Clock,CheckCircle,AlertCircle,User,Mail,Phone,Eye,Gavel,Filter,LogOut,Home,Trash2} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

type CaseItem = {
  documents?: string[] | string;
  downloadLink?: string | undefined;
  _id: string;
  fileName: string;
  description: string;
  aiSolution: string;
  date: string;
  createdAt?: string;
  status: "pending" | "in-progress" | "completed" | "urgent";
  clientName: string;
  priority: "high" | "medium" | "low";
  caseType: string;
  estimatedHours?: number;
};

type User = {
  _id: string;
  role: string;
  name?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  experience?: string;
  barNumber?: string;
  profileImage?: string;
};

type TabId =
  | "profile"
  | "openCases"
  | "cases"
  | "clients"
  | "analytics"
  | "calendar"
  | "messages";

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

const LawyerDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [user, setUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User>({
    _id: "",
    profileImage: "",
    role: "lawyer",
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    barNumber: "",
  });
  useEffect(() => {
    const fetchUserData = async () => {
      if (!editUser?.email) return;

      try {
        const res = await fetch("/api/getProfile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: editUser.email }),
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setEditUser(data);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserData();
  }, [editUser.email]);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [acceptedCases, setAcceptedCases] = useState<CaseItem[]>([]);
  const [openCases, setOpenCases] = useState<CaseItem[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"view" | "ai" | "court" | null>(null);
  const [clientsById, setClientsById] = useState<Record<string, { _id: string; name: string; email?: string; phone?: string; profileImage?: string }>>({});

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          console.error("Error fetching user info:", data.error);
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        router.push("/login");
      }
    };

    checkAuthAndFetchUser();
  }, [router]);

  useEffect(() => {
    const fetchCases = async () => {
      if (!user?._id) return;

      try {
        // Fetch accepted cases
        const assignedRes = await fetch("/api/case/assigned", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            role: "lawyer",
          }),
        });

        const assignedData = await assignedRes.json();
        if (assignedRes.ok) {
          const normalizedCases = assignedData.cases.map((caseItem: any) => ({
            ...caseItem,
            aiSolution: caseItem.aiSolution || caseItem.analysis || "",
          }));

          // Enrich accepted cases with client names
          const getIdString = (val: any): string => {
            if (!val) return "";
            if (typeof val === "string") return val;
            if (typeof val === "object") {
              const anyVal: any = val;
              if (anyVal.$oid) return anyVal.$oid as string;
              if (typeof anyVal.toString === "function") return anyVal.toString();
            }
            return String(val);
          };

          const clientIds = Array.from(
            new Set(
              normalizedCases
                .map((c: any) => getIdString(c.clientId))
                .filter((id: any) => !!id)
            )
          );

          let idToName: Record<string, string> = {};
          let idToClient: Record<string, any> = {};
          if (clientIds.length > 0) {
            try {
              const usersRes = await fetch("/api/user/list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: clientIds }),
              });
              const users = await usersRes.json();
              if (usersRes.ok && Array.isArray(users)) {
                idToName = users.reduce((acc: Record<string, string>, u: any) => { acc[u._id] = u.name || "Client"; return acc; }, {});
                idToClient = users.reduce((acc: Record<string, any>, u: any) => { acc[u._id] = u; return acc; }, {});
              }
            } catch {
              // ignore name fetch failures, fallback below
            }
          }

          const enrichedAccepted = normalizedCases.map((c: any) => ({
            ...c,
            clientName: idToName[getIdString(c.clientId)] || c.clientName || "Client",
          }));

          setAcceptedCases(enrichedAccepted);
          setClientsById((prev) => ({ ...prev, ...idToClient }));
        }

        // Fetch open cases
        const openRes = await fetch("/api/case/open");
        const openData = await openRes.json();
        if (openRes.ok && Array.isArray(openData.cases)) {
          const normalizedOpenCases = openData.cases.map((caseItem: any) => ({
            ...caseItem,
            aiSolution: caseItem.aiSolution || caseItem.analysis || "",
          }));

          // Resolve client names for display in modal
          const getIdString = (val: any): string => {
            if (!val) return "";
            if (typeof val === "string") return val;
            if (typeof val === "object") {
              // handle {"$oid":"..."} shape
              const anyVal: any = val;
              if (anyVal.$oid) return anyVal.$oid as string;
              if (typeof anyVal.toString === "function") return anyVal.toString();
            }
            return String(val);
          };

          const clientIds = Array.from(
            new Set(
              normalizedOpenCases
                .map((c: any) => getIdString(c.clientId))
                .filter((id: any) => !!id)
            )
          );
          let idToName: Record<string, string> = {};
          let idToClient: Record<string, any> = {};
          if (clientIds.length > 0) {
            try {
              const usersRes = await fetch("/api/user/list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: clientIds }),
              });
              const users = await usersRes.json();
              if (usersRes.ok && Array.isArray(users)) {
                idToName = users.reduce((acc: Record<string, string>, u: any) => {
                  acc[u._id] = u.name || "Client";
                  return acc;
                }, {});
                idToClient = users.reduce((acc: Record<string, any>, u: any) => { acc[u._id] = u; return acc; }, {});
              }
            } catch {
              // ignore name fetch failures, fallback below
            }
          }

          const enriched = normalizedOpenCases.map((c: any) => ({
            ...c,
            clientName: idToName[getIdString(c.clientId)] || "Client",
          }));

          setOpenCases(enriched);
          setClientsById((prev) => ({ ...prev, ...idToClient }));
        } else {
          setOpenCases([]);
        }
      } catch (err) {
        console.error("Error fetching cases:", err);
      }
    };

    fetchCases();
  }, [user]);
  useEffect(() => {
    if (!user) return;
    setEditUser({
      ...user,
      profileImage: user.profileImage || "",
    });
  }, [user]);

  const acceptCase = async (caseId: string) => {
    try {
      const res = await fetch("/api/case/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: caseId,
          lawyerId: user?._id,
        }),
      });

      if (res.ok) {
        const accepted = openCases.find((c) => c._id === caseId);
        if (accepted) {
          setAcceptedCases((prev) => [
            ...prev,
            { ...accepted, status: "in-progress" },
          ]);
          setOpenCases((prev) => prev.filter((c) => c._id !== caseId));

          alert("Case accepted successfully!");
        }
      } else {
        alert("Failed to accept case");
      }
    } catch (err) {
      console.error("Error accepting case:", err);
    }
  };

  const unassignCase = async (caseId: string) => {
    if (!confirm("Remove this case from your accepted list? It will return to Open Cases.")) return;
    try {
      const res = await fetch("/api/case/unassign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, lawyerId: user?._id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to unassign");
      const removed = acceptedCases.find((c) => c._id === caseId);
      setAcceptedCases((prev) => prev.filter((c) => c._id !== caseId));
      if (removed) {
        setOpenCases((prev) => [{ ...removed, status: "open" as any }, ...prev]);
      }
      alert("Case unassigned successfully");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Unknown error");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredCases = acceptedCases.filter(
    (caseItem) => filterStatus === "all" || caseItem.status === filterStatus
  );

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

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "openCases", label: "Open Cases", icon: <Gavel size={18} /> },
    { id: "cases", label: "Case Management", icon: <Scale size={18} /> },
    { id: "clients", label: "Client Directory", icon: <Users size={18} /> },
    { id: "analytics", label: "Analytics", icon: <TrendingUp size={18} /> },
    { id: "calendar", label: "Calendar", icon: <Calendar size={18} /> },
    { id: "messages", label: "Messages", icon: <MessageSquare size={18} /> },
  ];

  const stats = [
    {
      label: "Active Cases",
      value: acceptedCases.filter((c) => c.status === "in-progress").length,
      icon: <Scale size={20} />,
      color: "bg-blue-500",
    },
    {
      label: "Pending Review",
      value: acceptedCases.filter((c) => c.status === "pending").length,
      icon: <Clock size={20} />,
      color: "bg-yellow-500",
    },
    {
      label: "Completed",
      value: acceptedCases.filter((c) => c.status === "completed").length,
      icon: <CheckCircle size={20} />,
      color: "bg-green-500",
    },
    {
      label: "Urgent Cases",
      value: acceptedCases.filter((c) => c.status === "urgent").length,
      icon: <AlertCircle size={20} />,
      color: "bg-red-500",
    },
  ];

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
        role: "lawyer",
        name: editUser.name,
        profileImage: editUser.profileImage,
        specialization: editUser.specialization,
        experience: editUser.experience,
        barNumber: editUser.barNumber,
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
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 pt-4">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Scale className="text-indigo-600" size={28} />
            <h1 className="text-2xl font-bold text-indigo-600">
              Lawyer Dashboard
            </h1>
          </div>
          {user && (
            <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
              <Link href="/" className="text-indigo-600 hover:text-indigo-800 transition" title="Go to Homepage">
                <Home size={24} />
              </Link>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center hover:ring-2 ring-indigo-300 transition cursor-pointer"
              >
                {user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="text-indigo-600" size={20} />
                )}
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute top-14 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[180px] z-50">
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
          <div className="max-w-7xl mx-auto px-6 py-2">
            <p className="text-gray-600 font-medium">
              Welcome back,{" "}
              <span className="font-semibold text-indigo-700">
                {user.name}
              </span>
              {user.specialization && (
                <span className="text-xs text-gray-500 ml-2">
                  • {user.specialization}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 pt-2 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold mb-6">
                Professional Profile
              </h2>

              {user?.profileImage && (
                <div className="flex justify-center mb-6">
                  <Image
                    src={user.profileImage}
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-indigo-500"
                  />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Full Name</p>
                      <p className="text-gray-600">{user?.name || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">
                        {user?.email || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">
                        {user?.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Scale className="text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Specialization</p>
                      <p className="text-gray-600">
                        {user?.specialization || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Experience</p>
                      <p className="text-gray-600">
                        {user?.experience || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Bar Registration</p>
                      <p className="text-gray-600">
                        {user?.barNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Open Cases Tab */}
          {activeTab === "openCases" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4">
                Available Open Cases
              </h2>
              {Array.isArray(openCases) && openCases.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-sm">
                      <th className="p-2">Case ID</th>
                      <th className="p-2">Title</th>
                      <th className="p-2">Description</th>
                      <th className="p-2">Case File</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openCases.map((caseItem) => (
                      <tr
                        key={caseItem._id}
                        className="border-t text-sm hover:bg-gray-50"
                      >
                        <td className="p-2 font-medium text-indigo-600">
                          #{caseItem._id}
                        </td>

                        <td className="p-2 whitespace-nowrap">
                          {caseItem.fileName}
                        </td>
                        <td className="p-2">
                          {caseItem.description?.slice(0, 40)}...
                        </td>
                        <td className="p-2">
                          {caseItem.documents ? (
                            <a
                              href={Array.isArray(caseItem.documents)
                                ? `/uploads/${caseItem.documents[0]}`
                                : `/uploads/${caseItem.documents}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 underline"
                            >
                              View
                            </a>
                          ) : (
                            <span className="text-gray-400">No file</span>
                          )}
                        </td>
                        <td className="p-2 flex flex-col gap-1">
                          <button
                            onClick={() => {
                              setSelectedCase(caseItem);
                              setModalType("view");
                              setShowModal(true);
                            }}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 text-xs"
                          >
                            View Case
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCase(caseItem);
                              setModalType("ai");
                              setShowModal(true);
                            }}
                            className="bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 text-xs"
                          >
                            View AI Summary
                          </button>
                          <button
                            onClick={() => acceptCase(caseItem._id)}
                            className="bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 text-xs"
                          >
                            Accept Case
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">
                  No open cases available right now.
                </p>
              )}
            </motion.div>
          )}

          {/* Cases Tab */}
          {activeTab === "cases" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Case Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter size={16} className="text-gray-500" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                      <option value="all">All Cases</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="urgent">Urgent</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Case ID
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Client
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Case Type
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Priority
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCases.map((caseItem) => (
                      <tr key={caseItem._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-indigo-600">
                          <Link href={`/Dashboard/lawyer/case/${caseItem._id}`} className="underline">
                            #{caseItem._id}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{caseItem.clientName}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                            {caseItem.caseType}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="truncate" title={caseItem.description}>
                            {caseItem.description}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                              caseItem.status
                            )}`}
                          >
                            {caseItem.status.replace("-", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-medium ${getPriorityColor(
                              caseItem.priority
                            )}`}
                          >
                            {caseItem.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {caseItem.date}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              className="text-indigo-600 hover:text-indigo-800"
                              onClick={() => {
                                setSelectedCase(caseItem);
                                setShowModal(true);
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            {caseItem.documents && (
                              <a
                                href={Array.isArray(caseItem.documents)
                                  ? `/uploads/${caseItem.documents[0]}`
                                  : `/uploads/${caseItem.documents}`}
                                className="text-green-600 hover:text-green-800"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View document"
                              >
                                <Eye size={16} />
                              </a>
                            )}
                            <button
                              className="text-green-600 hover:text-green-800 text-xs underline"
                              onClick={() => {
                                setSelectedCase(caseItem);
                                setModalType("court");
                                setShowModal(true);
                              }}
                            >
                              Update Court Details
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              title="Unassign Case"
                              onClick={() => unassignCase(caseItem._id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Clients Tab */}
          {activeTab === "clients" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Client Directory</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from(new Set(acceptedCases.map((c) => (c as any).clientId))).map((cidAny, index) => {
                  const cid = typeof cidAny === "string" ? cidAny : (cidAny as any)?.$oid || String(cidAny);
                  const client = clientsById[cid];
                  const name = client?.name || acceptedCases.find((c) => (c as any).clientId === cidAny)?.clientName || "Client";
                  const wa = client?.phone ? `https://wa.me/${String(client.phone).replace(/\D/g, "")}` : null;
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        {client?.profileImage ? (
                          <img src={client.profileImage} alt="Client" className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="text-indigo-600" size={20} />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{name}</h3>
                          <p className="text-sm text-gray-600">{client?.email || ""}</p>
                          <div className="flex items-center gap-3 mt-1">
                            {wa ? (
                              <a href={wa} target="_blank" rel="noopener noreferrer" className="text-green-600 underline text-sm">WhatsApp</a>
                            ) : (
                              <span className="text-gray-400 text-sm">WhatsApp N/A</span>
                            )}
                            {client?.email && (
                              <a href={`mailto:${client.email}`} className="text-indigo-600 underline text-sm">Email</a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold mb-6">
                Performance Analytics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Case Distribution</h3>
                  <div className="space-y-3">
                    {Object.entries(
                      acceptedCases.reduce((acc, c) => {
                        acc[c.caseType] = (acc[c.caseType] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([type, count]) => (
                      <div
                        key={type}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">{type}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Monthly Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Cases</span>
                      <span className="font-medium">
                        {acceptedCases.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Completion Rate</span>
                      <span className="font-medium">
                        {Math.round(
                          (acceptedCases.filter((c) => c.status === "completed")
                            .length /
                            acceptedCases.length) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Estimated Hours</span>
                      <span className="font-medium">
                        {acceptedCases.reduce(
                          (sum, c) => sum + (c.estimatedHours || 0),
                          0
                        )}
                        h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Calendar Tab */}
          {activeTab === "calendar" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold mb-6">
                Calendar & Appointments
              </h2>
              <div className="text-center py-12">
                <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">
                  Calendar integration coming soon
                </p>
              </div>
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Client Messages</h2>
              {acceptedCases.length === 0 ? (
                <p className="text-gray-600">No assigned cases yet.</p>
              ) : (
                <div className="space-y-4">
                  {acceptedCases.map((c) => (
                    <div key={c._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">Case #{c._id}</p>
                          <p className="text-sm text-gray-600">Client: {c.clientName || "Client"}</p>
                        </div>
                        <button
                          className="text-indigo-600 underline text-sm"
                          onClick={() => {
                            setSelectedCase(c);
                            setModalType("view");
                            setShowModal(true);
                          }}
                        >
                          View Case
                        </button>
                      </div>
                      {Boolean((c as any)?.notes?.length) ? (
                        <ul className="space-y-2">
                          {((c as any).notes as Array<any>).slice().reverse().map((n, i) => (
                            <li key={i} className="bg-gray-50 border rounded p-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{n.by || "client"}</span>
                                <span className="text-xs text-gray-500">{n.at ? new Date(n.at).toLocaleString() : ""}</span>
                              </div>
                              <p className="mt-1 whitespace-pre-wrap">{n.text}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 text-sm">No messages yet.</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
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

              <Input
                label="Specialization"
                value={editUser.specialization}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditUser({ ...editUser, specialization: e.target.value })
                }
              />

              <Input
                label="Experience"
                value={editUser.experience}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditUser({ ...editUser, experience: e.target.value })
                }
              />

              <Input
                label="Bar Number"
                value={editUser.barNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditUser({ ...editUser, barNumber: e.target.value })
                }
              />

              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
      {showModal && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
            >
              ✖
            </button>
            {modalType === "view" && (
              <>
                <h2 className="text-lg font-semibold mb-4">Case Details</h2>
                <p>
                  <strong>ID:</strong> #{selectedCase._id}
                </p>
                <p>
                  <strong>Client:</strong> {selectedCase.clientName || "Client"}
                </p>
                <p>
                  <strong>Type:</strong> {selectedCase.caseType}
                </p>
                <p>
                  <strong>Description:</strong> {selectedCase.description}
                </p>
                <p>
                  <strong>Status:</strong> {selectedCase.status}
                </p>
                <p>
                  <strong>Priority:</strong> {selectedCase.priority}
                </p>
                <p>
                  <strong>Date:</strong> {selectedCase.createdAt ? new Date(selectedCase.createdAt as any).toLocaleString() : (selectedCase.date || "")}
                </p>
                {/* Client Messages / Notes */}
                {(selectedCase as any)?.notes?.length ? (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Client Messages</h3>
                    <ul className="space-y-2">
                      {((selectedCase as any).notes as Array<any>).map((n, i) => (
                        <li key={i} className="border rounded p-2 text-sm bg-gray-50">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{n.by || "client"}</span>
                            <span className="text-xs text-gray-500">{n.at ? new Date(n.at).toLocaleString() : ""}</span>
                          </div>
                          <p className="mt-1 whitespace-pre-wrap">{n.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            )}
            {modalType === "ai" && (
              <>
                <h2 className="text-lg font-semibold mb-4">AI Summary</h2>
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: convertMarkdownLiteToHtml(selectedCase.aiSolution || "") }}
                />
              </>
            )}
            {modalType === "court" && (
              <CourtDetailsForm
                caseId={selectedCase._id}
                onClose={() => setShowModal(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerDashboard;

const CourtDetailsForm = ({
  caseId,
  onClose,
}: {
  caseId: string;
  onClose: () => void;
}) => {
  const [lastHearingDate, setLastHearingDate] = React.useState<string>("");
  const [lastHearingSummary, setLastHearingSummary] = React.useState<string>("");
  const [nextHearingDate, setNextHearingDate] = React.useState<string>("");
  const [orders, setOrders] = React.useState<string[]>([]);
  const [newOrder, setNewOrder] = React.useState<string>("");
  const [saving, setSaving] = React.useState<boolean>(false);

  const addOrder = () => {
    if (!newOrder.trim()) return;
    setOrders((prev) => [...prev, newOrder.trim()]);
    setNewOrder("");
  };

  const removeOrder = (idx: number) => {
    setOrders((prev) => prev.filter((_, i) => i !== idx));
  };

  const save = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/case/updateHearing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          hearingDetails: {
            lastHearingDate: lastHearingDate || undefined,
            lastHearingSummary: lastHearingSummary || undefined,
            nextHearingDate: nextHearingDate || undefined,
            orders,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      alert("Court details updated");
      onClose();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Update Court Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Last Hearing Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={lastHearingDate}
            onChange={(e) => setLastHearingDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Next Hearing Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={nextHearingDate}
            onChange={(e) => setNextHearingDate(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Last Hearing Summary</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={4}
            value={lastHearingSummary}
            onChange={(e) => setLastHearingSummary(e.target.value)}
            placeholder="Enter a concise summary of the last hearing"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Orders</label>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 border rounded px-3 py-2"
              value={newOrder}
              onChange={(e) => setNewOrder(e.target.value)}
              placeholder="Add an order"
            />
            <button
              type="button"
              onClick={addOrder}
              className="px-3 py-2 bg-gray-100 border rounded hover:bg-gray-200"
            >
              Add
            </button>
          </div>
          {orders.length > 0 && (
            <ul className="list-disc list-inside space-y-1">
              {orders.map((o, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{o}</span>
                  <button
                    type="button"
                    onClick={() => removeOrder(idx)}
                    className="text-red-600 text-xs underline"
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 border rounded"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
};
