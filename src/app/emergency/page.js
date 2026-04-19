'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';

export default function EmergencyPage() {
  const [contact, setContact] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sosHistory, setSosHistory] = useState([]);

  useEffect(() => {
    fetchContact();
    fetchSosHistory();
  }, []);

  const fetchContact = async () => {
    try {
      const res = await fetch('/api/emergency-contact');
      const json = await res.json();
      if (json.success && json.data) {
        setContact(json.data);
      }
    } catch (error) {
      console.error('Error fetching contact:', error);
    }
  };

  const fetchSosHistory = async () => {
    try {
      const res = await fetch('/api/sos/history');
      const json = await res.json();
      if (json.success) {
        setSosHistory(json.data);
      }
    } catch (error) {
      console.error('Error fetching SOS history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/emergency-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
      const json = await res.json();
      if (json.success) {
        setMessage('Emergency contact saved successfully!');
      } else {
        setMessage('Error: ' + json.error);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const triggerSOS = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch('/api/sos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude, longitude }),
        });
        const json = await res.json();
        if (json.success) {
          alert(json.message || 'SOS Alert Sent Successfully!');
          fetchSosHistory(); // Refresh history
        } else {
          alert('Failed to send SOS: ' + json.error);
        }
      } catch (error) {
        alert('An error occurred while sending SOS.');
      } finally {
        setLoading(false);
      }
    }, (error) => {
      alert('Unable to retrieve your location: ' + error.message);
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Form and SOS */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🚨</span> Emergency Contact
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trusted Contact Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (with country code)</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    placeholder="e.g. +8801700000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trusted Contact Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="e.g. contact@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Contact'}
                </button>
                {message && <p className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
              </form>
            </div>

            <div className="bg-red-50 p-8 rounded-xl shadow-lg border border-red-200 text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">One-Tap SOS</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Pressing this button will immediately send your current GPS location to your trusted contact.
              </p>
              <button
                onClick={triggerSOS}
                disabled={loading}
                className="w-32 h-32 bg-red-600 hover:bg-red-700 text-white rounded-full font-black text-2xl shadow-xl transform active:scale-95 transition flex items-center justify-center mx-auto border-8 border-red-200"
              >
                SOS
              </button>
            </div>
          </div>

          {/* Right Column: SOS History */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">📜</span> Recent Alerts
            </h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {sosHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent alerts found.</p>
              ) : (
                sosHistory.map((sos) => (
                  <div key={sos._id} className="p-4 border rounded-lg bg-gray-50 border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        sos.status === 'Sent' ? 'bg-green-100 text-green-700' : 
                        sos.status === 'Logged (Dev Mode)' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {sos.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(sos.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Sent to: <strong>{sos.contactName}</strong>
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {sos.contactEmail} | {sos.contactPhone}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <a 
                        href={`https://www.google.com/maps?q=${sos.latitude},${sos.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition"
                      >
                        📍 Map
                      </a>
                      {sos.previewUrl && (
                        <a 
                          href={sos.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 transition"
                        >
                          ✉️ View Email
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
