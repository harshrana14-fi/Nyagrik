'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const ClientDashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [aiResult, setAiResult] = useState<string>('');
  type CaseHistoryItem = {
    fileName: string;
    description: string;
    aiSolution: string;
    date: string;
  };
  const [caseHistory, setCaseHistory] = useState<CaseHistoryItem[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !description) return alert('Please upload a file and enter description');

    // Simulate AI response
    const fakeAIResponse = `AI Analysis for: ${description.substring(0, 30)}...`;

    const newCase = {
      fileName: file.name,
      description,
      aiSolution: fakeAIResponse,
      date: new Date().toLocaleDateString(),
    };

    setCaseHistory([newCase, ...caseHistory]);
    setAiResult(fakeAIResponse);
    setFile(null);
    setDescription('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <motion.h1
        className="text-3xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Client Dashboard
      </motion.h1>

      {/* Upload Section */}
      <Card className="p-6 shadow-xl">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Upload New Case</h2>
          <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
          <Textarea
            placeholder="Enter case description..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
  onClick={handleSubmit}
  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-md transition duration-300"
>
  <UploadCloud size={20} /> Submit Case
</Button>

        </CardContent>
      </Card>

      {/* AI Result Section */}
      {aiResult && (
        <motion.div
          className="bg-gray-100 p-6 rounded-xl shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-lg font-semibold mb-2">AI Analysis:</h3>
          <p className="text-gray-800 whitespace-pre-line">{aiResult}</p>
        </motion.div>
      )}

      {/* Dashboard Table */}
      <Card className="shadow-xl">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Your Previous Cases</h2>
          <div className="overflow-x-auto">
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
                    <td className="p-2 whitespace-nowrap">{item.date}</td>
                    <td className="p-2 whitespace-nowrap">{item.fileName}</td>
                    <td className="p-2">{item.description.slice(0, 40)}...</td>
                    <td className="p-2">{item.aiSolution.slice(0, 50)}...</td>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
