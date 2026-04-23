'use client';

import React, { useState } from 'react';
<<<<<<< HEAD
import Header from '@/Components/Header';
=======
import Header from '@/components/Header';
>>>>>>> eabe9ef568161056c02fa8517def6f4ff7d36ed7
import Link from 'next/link';

export default function DriverDocsPage() {
  const [formData, setFormData] = useState({
    driverName: '',
    email: '',
    phone: '',
    vehicleNumber: '',
    vehicleType: '',
    notes: '',
  });
  const [licenseFile, setLicenseFile] = useState(null);
  const [registrationFile, setRegistrationFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!licenseFile || !registrationFile) {
      setMessage('Please upload both your driving license and vehicle registration.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      fd.append('license', licenseFile);
      fd.append('registration', registrationFile);
      const res = await fetch('/api/driver-docs', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setStep(2);
      } else {
        setMessage(data.error || 'Submission failed. Please try again.');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({ driverName: '', email: '', phone: '', vehicleNumber: '', vehicleType: '', notes: '' });
    setLicenseFile(null);
    setRegistrationFile(null);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {/* Card Header */}
          <div className="bg-green-600 text-white rounded-t-xl px-6 py-5 flex items-center gap-4">
            <div className="bg-white/20 rounded-xl p-3 text-2xl">📋</div>
            <div>
              <h1 className="text-2xl font-bold">Driver Documentation Portal</h1>
              <p className="text-green-100 text-sm mt-0.5">
                Submit your documents to become a verified GoRide driver
              </p>
            </div>
          </div>

          {step === 2 ? (
            /* ── Success ── */
            <div className="bg-white shadow-lg rounded-b-xl p-10 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Documents Submitted!</h2>
              <p className="text-gray-600 mb-2">
                Your driving license and vehicle registration have been received.
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Our team will review your documents within 24–48 hours.
              </p>
              <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg text-sm mb-8">
                ⏳ Status: <strong>Pending Review</strong>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/Dashboard">
                  <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition">
                    Go to Dashboard
                  </button>
                </Link>
                <button
                  onClick={resetForm}
                  className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 px-6 rounded-lg transition"
                >
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-b-xl divide-y divide-gray-100">
              {/* Step 1 – Personal Info */}
              <div className="px-6 py-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" name="driverName" value={formData.driverName}
                      onChange={handleChange} required placeholder="e.g. Emtiaz Halim"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email" name="email" value={formData.email}
                      onChange={handleChange} required placeholder="you@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel" name="phone" value={formData.phone}
                      onChange={handleChange} required placeholder="+880-1XXX-XXXXXX"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 – Vehicle Info */}
              <div className="px-6 py-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                  Vehicle Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" name="vehicleNumber" value={formData.vehicleNumber}
                      onChange={handleChange} required placeholder="e.g. DHA-KA-12-3456"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="vehicleType" value={formData.vehicleType}
                      onChange={handleChange} required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                    >
                      <option value="">Select type</option>
                      <option value="Car">Car</option>
                      <option value="Micro">Micro</option>
                      <option value="Bike">Bike</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3 – Document Uploads */}
              <div className="px-6 py-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                  Upload Documents
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Driving License */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driving License <span className="text-red-500">*</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 cursor-pointer transition ${licenseFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50'}`}>
                      <span className="text-3xl mb-2">{licenseFile ? '✅' : '🪪'}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {licenseFile ? licenseFile.name : 'Click to upload'}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG</span>
                      <input
                        type="file" accept="image/*,.pdf" className="hidden"
                        onChange={(e) => setLicenseFile(e.target.files[0])}
                      />
                    </label>
                  </div>

                  {/* Registration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Registration <span className="text-red-500">*</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 cursor-pointer transition ${registrationFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50'}`}>
                      <span className="text-3xl mb-2">{registrationFile ? '✅' : '📄'}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {registrationFile ? registrationFile.name : 'Click to upload'}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG</span>
                      <input
                        type="file" accept="image/*,.pdf" className="hidden"
                        onChange={(e) => setRegistrationFile(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Optional Notes */}
              <div className="px-6 py-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  name="notes" value={formData.notes} onChange={handleChange} rows={2}
                  placeholder="Any additional info..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 resize-none"
                />
              </div>

              {/* Footer */}
              <div className="px-6 py-5 bg-gray-50 rounded-b-xl">
                {message && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    ⚠️ {message}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <button
                    type="submit" disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2.5 px-8 rounded-lg transition"
                  >
                    {loading ? 'Submitting...' : '🔒 Submit Documents'}
                  </button>
                  <Link href="/Dashboard">
                    <button type="button" className="text-gray-500 hover:text-gray-700 font-medium py-2.5 px-4">
                      Cancel
                    </button>
                  </Link>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  🔒 Documents are stored securely and used solely for driver verification.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
