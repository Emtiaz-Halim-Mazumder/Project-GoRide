"use client";
import { useState } from "react";
import Link from "next/link";

export default function Verify() {
  const [file, setFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const upload = async () => {
    setIsVerifying(true);

    const formData = new FormData();
    formData.append("idcard", file);

    const response = await fetch("/api/verification", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setIsVerified(true);
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

              {file && (
                <p className="mt-3 text-sm text-green-600">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={upload}
              disabled={!file || isVerifying}
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