"use client";
import { useState } from "react";

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
    <>
      {/* Tailwind CDN */}
      <script src="https://cdn.tailwindcss.com"></script>

      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center p-6">

        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            🎓 Upload Student ID Card
          </h2>

          {isVerified ? (
            <div className="text-center py-10">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-semibold text-gray-800">Verified Successful!</h3>
              <p className="text-gray-500 mt-2">Your ID card has been processed.</p>
            </div>
          ) : (
            <>
              {/* File Input */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition">

                <input
                  type="file"
                  className="block w-full text-sm text-gray-600
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
                  onChange={(e) => setFile(e.target.files[0])}
                />

                {file && (
                  <p className="mt-3 text-sm text-green-600">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              {/* Button */}
              <button
                onClick={upload}
                disabled={!file || isVerifying}
                className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold
                hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify ID Card"}
              </button>
            </>
          )}

        </div>

      </div>
    </>
  );
}