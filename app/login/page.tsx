'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaUserTie, FaGraduationCap, FaArrowLeft, FaHome } from 'react-icons/fa';

const LoginPage = () => {
  const [role, setRole] = useState<'client' | 'lawyer' | 'intern' | null>(null);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Add real auth logic here

    if (role === 'client') router.push('/Dashboard/client');
  else if (role === 'lawyer') router.push('/Dashboard/lawyer');
    else if (role === 'intern') router.push('/Dashboard/intern');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Nyay Login</h1>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-500 hover:text-indigo-600 flex items-center space-x-1"
          >
            <FaHome />
            <span>Go to Homepage</span>
          </button>
        </div>

        {/* Step 1: Role Selection */}
        {!role && (
          <>
            <p className="text-gray-600 mb-6 text-sm">Select your role to continue login.</p>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setRole('client')}
                className="flex items-center justify-between px-5 py-3 rounded-lg border hover:shadow-md transition bg-gray-50 hover:bg-indigo-50 border-gray-300 text-gray-700"
              >
                <span className="font-medium">Client</span>
                <FaUser />
              </button>
              <button
                onClick={() => setRole('lawyer')}
                className="flex items-center justify-between px-5 py-3 rounded-lg border hover:shadow-md transition bg-gray-50 hover:bg-indigo-50 border-gray-300 text-gray-700"
              >
                <span className="font-medium">Lawyer</span>
                <FaUserTie />
              </button>
              <button
                onClick={() => setRole('intern')}
                className="flex items-center justify-between px-5 py-3 rounded-lg border hover:shadow-md transition bg-gray-50 hover:bg-indigo-50 border-gray-300 text-gray-700"
              >
                <span className="font-medium">Law Student / Intern</span>
                <FaGraduationCap />
              </button>
            </div>
          </>
        )}

        {/* Step 2: Login Form */}
        {role && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center capitalize">
              Login as {role === 'intern' ? 'Law Student / Intern' : role}
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => setRole(null)}
                className="flex items-center justify-center w-full text-sm text-gray-500 hover:text-indigo-600 mt-2"
              >
                <FaArrowLeft className="mr-1" />
                Go Back
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
