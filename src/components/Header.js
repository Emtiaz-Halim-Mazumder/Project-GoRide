'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition">
            <div className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
              GoRide
            </div>
          </div>
        </Link>
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link href="/" className="hover:text-green-600 transition">Home</Link>
          <a href="#features" className="hover:text-green-600 transition">Features</a>
          <a href="#contact" className="hover:text-green-600 transition">Contact</a>
        </div>
        <div className="flex space-x-3">
          <Link href="/verification">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
              Verification
            </button>
          </Link>

          <Link href="/ClassSchedule">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
              Class Schedule
            </button>
          </Link>

          <Link href="/Dashboard">
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded-lg transition">
              Dashboard
            </button>
          </Link>

          <Link href="/emergency">
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition">
              SOS Support
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
