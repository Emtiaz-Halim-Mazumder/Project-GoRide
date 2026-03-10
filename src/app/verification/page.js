"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Verify() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const upload = async () => {
    if (!name || !email || !file) {
      alert("Please fill in all fields");
      return;
    }

    setIsVerifying(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("idcard", file);

    try {
      const response = await fetch("/api/verification", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Verified Successfully");
        setIsVerified(true);
      }
    } catch (error) {
      alert("Verification failed. Please try again.");
    }

    setIsVerifying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-6">
      

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border">

        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Verify Your Student ID
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Upload your student ID card to verify your account
        </p>

        {isVerified ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-6xl mb-4">✅</div>

            <h3 className="text-2xl font-semibold text-gray-900">
              Verification Successful!
            </h3>

            <p className="text-gray-600 mt-2">
              Your student ID has been verified.
            </p>

            <Link href="/Dashboard">
              <button className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition">
                Go to Dashboard
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>

            {/* File Upload Box */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition">

              <input
                type="file"
                className="block w-full text-sm text-gray-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
                onChange={(e) => setFile(e.target.files[0])}
              />

              {isMounted && file && (
                <p className="mt-3 text-sm text-green-600">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={upload}
              disabled={!name || !email || !file || isVerifying}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold
              hover:bg-green-700 transition disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify ID Card"}
            </button>
          </>
        )}
      </div>

    </div>
  );
}