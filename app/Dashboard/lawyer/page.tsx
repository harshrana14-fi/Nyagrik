'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Scale, 
  FileText, 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Eye,
  Download,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

type CaseItem = {
  id: string;
  fileName: string;
  description: string;
  aiSolution: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed' | 'urgent';
  clientName: string;
  priority: 'high' | 'medium' | 'low';
  caseType: string;
  estimatedHours?: number;
};

type User = {
  role: string;
  name?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  experience?: string;
  barNumber?: string;
};

type TabId = 'profile' | 'cases' | 'clients' | 'analytics' | 'calendar' | 'messages';

const LawyerDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [user, setUser] = useState<User | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [acceptedCases] = useState<CaseItem[]>([
    {
      id: '001',
      fileName: 'property_dispute.pdf',
      description: 'Client facing property dispute with neighbor regarding boundary issues',
      aiSolution: 'Applicable: Transfer of Property Act, 1882. Suggest mediation or civil suit under specific performance.',
      date: '2025-06-21',
      status: 'in-progress',
      clientName: 'Rajesh Kumar',
      priority: 'high',
      caseType: 'Property Law',
      estimatedHours: 25
    },
    {
      id: '002',
      fileName: 'contract_breach.pdf',
      description: 'Business contract breach case - supplier failed to deliver goods as per agreement',
      aiSolution: 'Indian Contract Act, 1872 - Section 73. Claim damages for breach of contract.',
      date: '2025-06-18',
      status: 'pending',
      clientName: 'Priya Sharma',
      priority: 'medium',
      caseType: 'Contract Law',
      estimatedHours: 15
    },
    {
      id: '003',
      fileName: 'employment_issue.pdf',
      description: 'Wrongful termination case - employee dismissed without proper notice',
      aiSolution: 'Industrial Disputes Act, 1947. File complaint with labour court for reinstatement.',
      date: '2025-06-15',
      status: 'urgent',
      clientName: 'Amit Verma',
      priority: 'high',
      caseType: 'Employment Law',
      estimatedHours: 20
    },
    {
      id: '004',
      fileName: 'divorce_proceedings.pdf',
      description: 'Mutual consent divorce case with asset division and custody arrangements',
      aiSolution: 'Hindu Marriage Act, 1955. Prepare mutual consent petition with settlement terms.',
      date: '2025-06-10',
      status: 'completed',
      clientName: 'Sunita Devi',
      priority: 'low',
      caseType: 'Family Law',
      estimatedHours: 30
    }
  ]);

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        const data = await res.json();
        
        if (res.ok) {
          setUser(data);
        } else {
          console.error('Error fetching user info:', data.error);
          router.push('/login');
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        router.push('/login');
      }
    };

    checkAuthAndFetchUser();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredCases = acceptedCases.filter(caseItem => 
    filterStatus === 'all' || caseItem.status === filterStatus
  );

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'cases', label: 'Case Management', icon: <Scale size={18} /> },
    { id: 'clients', label: 'Client Directory', icon: <Users size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={18} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={18} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
  ];

  const stats = [
    { label: 'Active Cases', value: acceptedCases.filter(c => c.status === 'in-progress').length, icon: <Scale size={20} />, color: 'bg-blue-500' },
    { label: 'Pending Review', value: acceptedCases.filter(c => c.status === 'pending').length, icon: <Clock size={20} />, color: 'bg-yellow-500' },
    { label: 'Completed', value: acceptedCases.filter(c => c.status === 'completed').length, icon: <CheckCircle size={20} />, color: 'bg-green-500' },
    { label: 'Urgent Cases', value: acceptedCases.filter(c => c.status === 'urgent').length, icon: <AlertCircle size={20} />, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <Scale className="text-indigo-600" size={28} />
          <h1 className="text-2xl font-bold text-indigo-600">Lawyer Dashboard</h1>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-gray-600 font-medium">
                Welcome back, <span className="font-semibold text-indigo-700">{user.name}</span>
              </p>
              <p className="text-xs text-gray-500">{user.specialization}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="text-indigo-600" size={20} />
            </div>
          </div>
        )}
      </nav>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
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
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
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
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Professional Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Full Name</p>
                      <p className="text-gray-600">{user?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">{user?.email || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Scale className="text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Specialization</p>
                      <p className="text-gray-600">{user?.specialization || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Experience</p>
                      <p className="text-gray-600">{user?.experience || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="text-gray-500" size={20} />
                    <div>
                      <p className="font-medium">Bar Registration</p>
                      <p className="text-gray-600">{user?.barNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Cases Tab */}
          {activeTab === 'cases' && (
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
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Case ID</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Client</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Case Type</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Description</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Priority</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCases.map((caseItem) => (
                      <tr key={caseItem.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-indigo-600">#{caseItem.id}</td>
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
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(caseItem.status)}`}>
                            {caseItem.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${getPriorityColor(caseItem.priority)}`}>
                            {caseItem.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{caseItem.date}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-800">
                              <Eye size={16} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800">
                              <Download size={16} />
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
          {activeTab === 'clients' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Client Directory</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from(new Set(acceptedCases.map(c => c.clientName))).map((clientName, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="text-indigo-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">{clientName}</h3>
                        <p className="text-sm text-gray-600">
                          {acceptedCases.filter(c => c.clientName === clientName).length} case(s)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Performance Analytics</h2>
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
                      <div key={type} className="flex justify-between items-center">
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
                      <span className="font-medium">{acceptedCases.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Completion Rate</span>
                      <span className="font-medium">
                        {Math.round((acceptedCases.filter(c => c.status === 'completed').length / acceptedCases.length) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Estimated Hours</span>
                      <span className="font-medium">
                        {acceptedCases.reduce((sum, c) => sum + (c.estimatedHours || 0), 0)}h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Calendar & Appointments</h2>
              <div className="text-center py-12">
                <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">Calendar integration coming soon</p>
              </div>
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Client Messages</h2>
              <div className="text-center py-12">
                <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">Messaging system coming soon</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyerDashboard;