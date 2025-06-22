// app/dashboard/lawyer/layout.tsx (same for /intern/layout.tsx)
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const navItems = [
  { name: 'Accepted Cases', href: '/Dashboard/lawyer' },
  { name: 'Available Cases', href: '/Dashboard/lawyer/available-cases' },
  { name: 'Home', href: '/' },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-6 space-y-4 shadow-md">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">Nyay Portal ⚖️</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2 rounded-lg font-medium ${
                pathname === item.href
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'text-gray-700 hover:bg-indigo-50'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
};

export default DashboardLayout;
