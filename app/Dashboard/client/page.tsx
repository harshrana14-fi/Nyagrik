'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

type CaseItem = {
  _id?: string;
  analysis?: string;
  fileName?: string;
  description: string;
  date: string;
};

type User = {
  role: string;
  name?: string;
  email?: string;
};

type TabId = 'profile' | 'upload' | 'history' | 'connect';

export default function ClientDashboardPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [user, setUser] = useState<User | null>(null);
  const [caseHistory, setCaseHistory] = useState<CaseItem[]>([]);

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        const data = await res.json();
        setUser(data);

        const historyRes = await fetch('/api/history', { credentials: 'include' });
        const historyData = await historyRes.json();

        if (historyRes.ok) {
          setCaseHistory(historyData.history);
        }
      } catch (err) {
        console.error('Error fetching user or history:', err);
        router.push('/login');
      }
    };

    checkAuthAndFetchUser();
  }, [router]); // ✅ router added to dependency array

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !description) return alert('Please upload a file and enter description');

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, fileName: file.name }),
    });

    const data = await res.json();

    if (!data.success) return alert('AI analysis failed');

    const newCase: CaseItem = {
      fileName: file.name,
      description,
      analysis: data.analysis,
      date: new Date().toISOString(),
    };

    setCaseHistory([newCase, ...caseHistory]);
    setAiResult(data.analysis);
    setFile(null);
    setDescription('');
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'upload', label: 'AI Case Upload' },
    { id: 'history', label: 'Report History' },
    { id: 'connect', label: 'Connect with Lawyer/Intern' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-indigo-600">Client Dashboard</h1>
        {user && (
          <p className="text-gray-600 font-medium">
            Welcome back, <span className="font-semibold text-indigo-700">{user.name}</span>
          </p>
        )}
      </nav>

      {/* Tabs */}
      <div className="flex space-x-4 justify-center mt-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} // ✅ No `as any` needed
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
            <p><strong>Role:</strong> Client</p>
            <p><strong>Email:</strong> {user?.email || 'Not provided'}</p>
          </motion.div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow"
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

        {/* History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-xl font-semibold mb-4">Report History</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200 text-sm">
                  <th className="p-2">Date</th>
                  <th className="p-2">File</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">AI Solution</th>
                </tr>
              </thead>
              <tbody>
                {caseHistory.map((item, index) => (
                  <tr key={index} className="border-t text-sm hover:bg-gray-50">
                    <td className="p-2 whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="p-2 whitespace-nowrap">{item.fileName || 'N/A'}</td>
                    <td className="p-2">{item.description?.slice(0, 40) || 'N/A'}...</td>
                    <td className="p-2">{item.analysis?.slice(0, 50) || 'N/A'}...</td>
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

        {/* Connect Tab */}
        {activeTab === 'connect' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-xl font-semibold mb-4">Connect With Lawyer or Intern</h2>
            <p className="text-gray-600">(Connection feature coming soon)</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
