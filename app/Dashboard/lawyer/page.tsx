"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {Scale,FileText,Users,Calendar,MessageSquare,TrendingUp,Clock,CheckCircle,AlertCircle,User,Mail,Phone,Eye,Gavel,Download,Filter,LogOut,Home,} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

type CaseItem = {
  documents: string;
  downloadLink: string | undefined;
  _id: string;
  fileName: string;
  description: string;
  aiSolution: string;
  date: string;
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
  const [modalType, setModalType] = useState<"view" | "ai" | null>(null);

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const normalizedCases = assignedData.cases.map((caseItem: any) => ({
            ...caseItem,
            aiSolution: caseItem.aiSolution || caseItem.analysis || "",
          }));
          setAcceptedCases(normalizedCases);
        }

        // Fetch open cases
        const openRes = await fetch("/api/case/open");
        const openData = await openRes.json();
        if (openRes.ok && Array.isArray(openData.cases)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const normalizedOpenCases = openData.cases.map((caseItem: any) => ({
            ...caseItem,
            aiSolution: caseItem.aiSolution || caseItem.analysis || "",
          }));
          setOpenCases(normalizedOpenCases);
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
                          <a
                            href={`/uploads/${caseItem.documents?.[0]}`}
                            download
                            className="text-blue-600 underline"
                          >
                            Download
                          </a>
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
                          #{caseItem._id}
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
                            <a
                              href={caseItem.downloadLink}
                              className="text-gray-600 hover:text-gray-800"
                              download
                            >
                              <Download size={16} />
                            </a>
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
                {Array.from(
                  new Set(acceptedCases.map((c) => c.clientName))
                ).map((clientName, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="text-indigo-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">{clientName}</h3>
                        <p className="text-sm text-gray-600">
                          {
                            acceptedCases.filter(
                              (c) => c.clientName === clientName
                            ).length
                          }{" "}
                          case(s)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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

              coming soon
              <div className="text-center py-12">
                <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">
                  Messaging feature is under development
                </p>
              </div>
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
                  <strong>Client:</strong> {selectedCase.clientName}
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
                  <strong>Date:</strong> {selectedCase.date}
                </p>
              </>
            )}
            {modalType === "ai" && (
              <>
                <h2 className="text-lg font-semibold mb-4">AI Summary</h2>
                <p className="whitespace-pre-wrap">{selectedCase.aiSolution}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerDashboard;
