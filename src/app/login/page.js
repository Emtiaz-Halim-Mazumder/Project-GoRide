"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [status, setStatus] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setResult("Please enter both email and password");
      setStatus("error");
      return;
    }

    setLoading(true);
    setResult("");
    setStatus(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult("Login successful! Redirecting...");
        setStatus("success");
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      } else {
        setResult(data.message || "Failed to login");
        setStatus("error");
      }
    } catch (err) {
      setResult("Server error occurred");
      setStatus("error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      
      <section className="max-w-md mx-auto px-6 py-16 md:py-24">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Login to your GoRide account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">University Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              />
            </div>

            {result && (
              <div className={`p-4 rounded-lg text-sm font-medium text-center ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {result}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full font-bold py-3 px-4 rounded-lg transition shadow-md ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            
            <div className="text-center text-sm text-gray-600 mt-4">
              Don't have an account? <Link href="/verification" className="text-green-600 hover:underline font-medium">Verify ID to Register</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
