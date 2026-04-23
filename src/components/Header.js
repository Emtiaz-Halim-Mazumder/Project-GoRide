"use client";

<<<<<<< HEAD
import React, { useState } from 'react';
import Link from 'next/link';
=======
import React, { useState } from "react";
import Link from "next/link";
>>>>>>> eabe9ef568161056c02fa8517def6f4ff7d36ed7

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition">
            <div className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
              GoRide
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
<<<<<<< HEAD
          <Link href="/" className="hover:text-green-600 transition">Home</Link>
          <Link href="/Dashboard" className="hover:text-green-600 transition">Dashboard</Link>
          <Link href="/DriverDocs" className="hover:text-green-600 transition">Driver Docs</Link>
=======
          <Link href="/" className="hover:text-green-600 transition">
            Home
          </Link>
          <Link href="/Dashboard" className="hover:text-green-600 transition">
            Dashboard
          </Link>
          <Link href="/DriverDocs" className="hover:text-green-600 transition">
            Driver Docs
          </Link>
>>>>>>> eabe9ef568161056c02fa8517def6f4ff7d36ed7
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Link href="/OfferRide">
            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm">
              Offer Ride
            </button>
          </Link>

          <Link href="/verification">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm">
              Verification
            </button>
          </Link>

          <Link href="/DriverDocs">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm hidden sm:block">
              Driver Docs
<<<<<<< HEAD
            </button>
          </Link>

          <Link href="/ClassSchedule">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm hidden sm:block">
              Schedule
=======
>>>>>>> eabe9ef568161056c02fa8517def6f4ff7d36ed7
            </button>
          </Link>

          <Link href="/ClassSchedule">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm hidden sm:block">
              Schedule
            </button>
          </Link>

          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-global-chat"))
            }
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
          >
            💬 Chat
          </button>

          <Link href="/Dashboard">
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded-lg transition text-sm">
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
