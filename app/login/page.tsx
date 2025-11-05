'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaUserTie, FaGraduationCap, FaArrowLeft, FaHome, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [role, setRole] = useState<'client' | 'lawyer' | 'intern' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // ⛔ prevents page refresh

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log('Login success:', data);
      alert('Login successful');
      // redirect based on role
      if (data.role === 'client') router.push('/Dashboard/client');
      else if (data.role === 'lawyer') router.push('/Dashboard/lawyer');
      else router.push('/Dashboard/intern');
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Login error:', err.message);
      alert('Login failed: ' + err.message);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Nyagrik Login</h1>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-500 hover:text-indigo-600 flex items-center space-x-1"
          >
            <FaHome />
            <span>Go to Homepage</span>
          </button>
        </div>

        {!role && (
          <>
            <p className="text-gray-600 mb-4 text-sm">Select your role to continue login.</p>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => setRole('client')} className="btn-role">
                <span className="font-medium">Client</span>
                <FaUser />
              </button>
              <button onClick={() => setRole('lawyer')} className="btn-role">
                <span className="font-medium">Lawyer</span>
                <FaUserTie />
              </button>
              <button onClick={() => setRole('intern')} className="btn-role">
                <span className="font-medium">Law Student / Intern</span>
                <FaGraduationCap />
              </button>
            </div>
          </>
        )}

        {role && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center capitalize">
              Login as {role === 'intern' ? 'Law Student / Intern' : role}
            </h2>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button type="submit" className="btn-submit">Login</button>
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

      {/* Tailwind utility classes you can extract or keep inline */}
      <style jsx>{`
        .btn-role {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1.25rem;
          background-color: #f9fafb;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          color: #374151;
          transition: background 0.2s ease;
        }
        .btn-role:hover {
          background-color: #e0e7ff;
        }
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          outline: none;
        }
        .input-field:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
        }
        .btn-submit {
          width: 100%;
          padding: 0.75rem;
          background-color: #4f46e5;
          color: white;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: background 0.2s ease;
        }
        .btn-submit:hover {
          background-color: #4338ca;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
