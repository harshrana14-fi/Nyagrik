// app/dashboard/lawyer/page.tsx
'use client';

import React, { useState } from 'react';

const LawyerDashboard = () => {
  const [acceptedCases] = useState([
    {
      id: '001',
      fileName: 'case1.pdf',
      description: 'Client facing property dispute with neighbor',
      aiSolution: 'Applicable: Transfer of Property Act, 1882. Suggest mediation or civil suit.',
      date: '2025-06-21',
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Accepted Cases</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">File</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">AI Solution</th>
            </tr>
          </thead>
          <tbody>
            {acceptedCases.map((caseItem) => (
              <tr key={caseItem.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{caseItem.date}</td>
                <td className="px-4 py-2">{caseItem.fileName}</td>
                <td className="px-4 py-2">{caseItem.description}</td>
                <td className="px-4 py-2">{caseItem.aiSolution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LawyerDashboard;
