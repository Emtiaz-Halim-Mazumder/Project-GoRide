"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!userId) {
      setResult("Invalid or missing user ID. Please complete verification first.");
      setStatus("error");
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    if (password !== confirmPassword) {
      setResult("Passwords do not match");
      setStatus("error");
      return;
    }

    if (password.length < 6) {
      setResult("Password must be at least 6 characters long");
      setStatus("error");
      return;
    }

    setLoading(true);
    setResult("");
    setStatus(null);

    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult("Password set successfully! Redirecting to login...");
        setStatus("success");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setResult(data.message || "Failed to set password");
        setStatus("error");
      }
    } catch (err) {
      setResult("Server error occurred");
      setStatus("error");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto p-8 md:p-10">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Set Your Password</h2>
      <p className="text-center text-gray-600 mb-8">Secure your verified account with a new password.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
          />
        </div>

        {result && (
          <div className={`p-4 rounded-lg font-medium text-center ${status === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
            {result}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !userId} 
          className={`w-full font-bold py-4 px-8 rounded-lg text-lg transition shadow-lg ${
            loading || !userId ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {loading ? "Saving..." : "Save Password"}
        </button>
      </form>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <SetPasswordForm />
        </Suspense>
      </section>
    </div>
  );
}
