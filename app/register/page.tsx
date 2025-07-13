'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUserTie,
  FaUser,
  FaGraduationCap,
  FaArrowLeft,
  FaHome,
} from 'react-icons/fa';

type Role = 'client' | 'lawyer' | 'intern';

interface RegisterData {
  fullName: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
  role: Role | null;
  barReg?: FormDataEntryValue | null;
  specialization?: FormDataEntryValue | null;
  university?: FormDataEntryValue | null;
}

const RegisterPage = () => {
  const [role, setRole] = useState<Role | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data: RegisterData = {
      role,
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    if (role === 'lawyer') {
      data.barReg = formData.get('barReg');
      data.specialization = formData.get('specialization');
    } else if (role === 'intern') {
      data.university = formData.get('university');
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push(`/Dashboard/${role}`);
    } else {
      alert('Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Nyagrik Registration</h1>
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
            <p className="text-gray-600 mb-6 text-sm">
              Please select your role to continue registration.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setRole('client')}
                className="flex items-center justify-between px-5 py-3 rounded-lg border hover:shadow-md transition bg-gray-50 hover:bg-indigo-50 border-gray-300 text-gray-700"
              >
                <span className="font-medium">Client</span>
                <FaUser className="text-lg" />
              </button>
              <button
                onClick={() => setRole('lawyer')}
                className="flex items-center justify-between px-5 py-3 rounded-lg border hover:shadow-md transition bg-gray-50 hover:bg-indigo-50 border-gray-300 text-gray-700"
              >
                <span className="font-medium">Lawyer</span>
                <FaUserTie className="text-lg" />
              </button>
              <button
                onClick={() => setRole('intern')}
                className="flex items-center justify-between px-5 py-3 rounded-lg border hover:shadow-md transition bg-gray-50 hover:bg-indigo-50 border-gray-300 text-gray-700"
              >
                <span className="font-medium">Law Student / Intern</span>
                <FaGraduationCap className="text-lg" />
              </button>
            </div>
          </>
        )}

        {/* Step 2: Form */}
        {role && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-2 capitalize text-center">
              Register as {role === 'intern' ? 'Law Student / Intern' : role}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="fullName"
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

              {/* Role-specific Fields */}
              {role === 'lawyer' && (
                <>
                  <input
                    name="barReg"
                    type="text"
                    placeholder="Bar Registration Number"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <select
                    name="specialization"
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                  >
                    <option value="">Select Specialization</option>
                    <option value="corporate">Corporate Law</option>
                    <option value="criminal">Criminal Law</option>
                    <option value="civil">Civil Law</option>
                    <option value="family">Family Law</option>
                    <option value="ip">Intellectual Property</option>
                    <option value="tax">Tax Law</option>
                    <option value="other">Other</option>
                  </select>
                </>
              )}

              {role === 'intern' && (
                <input
                  name="university"
                  type="text"
                  placeholder="Law School / University"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Complete Registration
              </button>

              {/* Back to Role Selection */}
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

export default RegisterPage;
