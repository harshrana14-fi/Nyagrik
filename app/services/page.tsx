'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  FaBalanceScale,
  FaGavel,
  FaBriefcase,
  FaUsers,
  FaShieldAlt,
  FaBook
} from 'react-icons/fa';

const services = [
  {
    icon: <FaBalanceScale className="text-3xl text-indigo-600" />,
    
    title: 'Corporate Law',
    description: 'Legal support for businesses including compliance, M&A, contracts, and advisory.',
  },
  {
    icon: <FaGavel className="text-3xl text-indigo-600" />,
    title: 'Criminal Defense',
    description: 'Representation in criminal matters including bail, FIR quashing, and trials.',
  },
  {
    icon: <FaBriefcase className="text-3xl text-indigo-600" />,
    title: 'Civil Litigation',
    description: 'Dispute resolution for property, contract breaches, and civil rights.',
  },
  {
    icon: <FaUsers className="text-3xl text-indigo-600" />,
    title: 'Family Law',
    description: 'Divorce, custody, maintenance, domestic violence, and personal law matters.',
  },
  {
    icon: <FaShieldAlt className="text-3xl text-indigo-600" />,
    title: 'Intellectual Property',
    description: 'Trademarks, patents, copyright filing, and IP enforcement.',
  },
  {
    icon: <FaBook className="text-3xl text-indigo-600" />,
    title: 'Taxation Law',
    description: 'Income tax, GST, appeals, and legal opinions on taxation issues.',
  },
];

const ExploreServicesPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 px-6 py-16">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Explore Our Legal Services</h1>
        <p className="text-gray-600 text-lg mb-10">
          From personal legal advice to full corporate support — Nyay offers a broad spectrum of legal services.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition border border-gray-100"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExploreServicesPage;
