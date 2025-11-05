'use client';

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';

const AvailableCases = () => {
  const [cases, setCases] = useState([
    {
      id: 'C-001',
      fileName: 'eviction_notice.pdf',
      description: 'Client is facing eviction from landlord without proper notice.',
      aiSolution: 'Applicable: Rent Control Act. Suggest legal notice and file in Small Causes Court.',
      date: '2025-06-22',
      accepted: false,
    },
    {
      id: 'C-002',
      fileName: 'cheque_bounce.docx',
      description: 'Cheque bounce issue with a supplier.',
      aiSolution: 'Applicable: Section 138, Negotiable Instruments Act. Recommend sending legal notice.',
      date: '2025-06-20',
      accepted: false,
    },
  ]);

  const handleAccept = (caseId: string) => {
    setCases(prev =>
      prev.map(c => c.id === caseId ? { ...c, accepted: true } : c)
    );
    alert(`Case ${caseId} accepted!`);
    // Later, also store this in DB under lawyer's accepted list
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Available Client Cases</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">File</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">AI Solution</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(c => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{c.date}</td>
                <td className="px-4 py-2">{c.fileName}</td>
                <td className="px-4 py-2">{c.description.slice(0, 50)}...</td>
                <td className="px-4 py-2">{c.aiSolution.slice(0, 50)}...</td>
                <td className="px-4 py-2">
                  {c.accepted ? (
                    <span className="text-green-600 font-medium">Accepted</span>
                  ) : (
                    <Button onClick={() => handleAccept(c.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded">
                      Accept Case
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {!cases.length && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No cases available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailableCases;
