'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function GoRidePage() {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    availableSeats: '',
    startTime: '',
    endTime: '',
    vehicleType: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [preferences, setPreferences] = useState({
    femaleOnly: false,
    noSmoking: false,
    quietRide: false,
    musicOk: false,
    petsAllowed: false,
    noEating: false,
    acRequired: false,
    studentOnly: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({ ...prev, [name]: checked }));
  };

  const handleCalculateFare = () => {
    alert(`Fare calculation for: ${formData.origin} to ${formData.destination}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.origin || !formData.destination || !formData.date || !formData.availableSeats || !formData.startTime || !formData.endTime || !formData.vehicleType) {
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, preferences }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to create ride');

      setMessage('Ride offered successfully!');
      setFormData({ origin: '', destination: '', date: '', availableSeats: '', startTime: '', endTime: '', vehicleType: '' });
      setPreferences({ femaleOnly: false, noSmoking: false, quietRide: false, musicOk: false, petsAllowed: false, noEating: false, acRequired: false, studentOnly: false });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const preferenceOptions = [
    { name: 'femaleOnly',  label: 'Female Only',    desc: 'Ride is open to female passengers only',   color: 'pink' },
    { name: 'noSmoking',  label: 'No Smoking',      desc: 'No smoking allowed in the vehicle',        color: 'gray' },
    { name: 'quietRide',  label: 'Quiet Ride',      desc: 'Prefer a silent or low-noise journey',     color: 'blue' },
    { name: 'musicOk',    label: 'Music OK',        desc: 'Music will be played during the ride',     color: 'purple' },
    { name: 'petsAllowed',label: 'Pets Allowed',    desc: 'Small pets are welcome',                   color: 'yellow' },
    { name: 'noEating',   label: 'No Eating',       desc: 'Please refrain from eating in the car',    color: 'orange' },
    { name: 'acRequired', label: 'AC Required',     desc: 'Air conditioning will be on',              color: 'cyan' },
    { name: 'studentOnly',label: 'Students Only',   desc: 'Ride is exclusively for students',         color: 'green' },
  ];

  const tagColors = {
    pink:   'bg-pink-100 text-pink-700 border-pink-300',
    gray:   'bg-gray-100 text-gray-700 border-gray-300',
    blue:   'bg-blue-100 text-blue-700 border-blue-300',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    orange: 'bg-orange-100 text-orange-700 border-orange-300',
    cyan:   'bg-cyan-100 text-cyan-700 border-cyan-300',
    green:  'bg-green-100 text-green-700 border-green-300',
  };

  const selectedCount = Object.values(preferences).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center p-4">

        {/* Main card */}
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl overflow-hidden">

          {/* Card Header */}
          <div className="bg-green-600 text-white py-4 px-6">
            <h1 className="text-2xl font-bold">GoRide</h1>
          </div>

          {/* Form Section */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Offer A Ride</h2>
            <p className="text-gray-600 mb-6">Share your commute with fellow students</p>

            {/* Message */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Origin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Starting Point (Origin)</label>
                <input
                  type="text" name="origin" value={formData.origin} onChange={handleInputChange}
                  placeholder="eg. Banani, 11/A Main St. Or BRAC University"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 text-gray-900"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input
                  type="text" name="destination" value={formData.destination} onChange={handleInputChange}
                  placeholder="eg. Gulshan, 11/A Main St. Or BRAC University"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 text-gray-900"
                />
              </div>

              {/* Date & Seats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date" name="date" value={formData.date} onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
                  <select name="availableSeats" value={formData.availableSeats} onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white">
                    <option value="">Select seats</option>
                    <option value="1">1 seat</option>
                    <option value="2">2 seats</option>
                    <option value="3">3 seats</option>
                    <option value="4">4 seats</option>
                    <option value="5">5+ seats</option>
                  </select>
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <div className="flex items-center gap-4">
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900" />
                  <span className="text-gray-500 font-medium">to</span>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Select start and end time</p>
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Types of Vehicle</label>
                <select name="vehicleType" value={formData.vehicleType} onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white">
                  <option value="">Select vehicle type</option>
                  <option value="Car">Car</option>
                  <option value="Micro">Micro</option>
                  <option value="Bike">Bike</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPreferencesModal(true)}
                  className="relative bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                >
                  Preferences
                  {selectedCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {selectedCount}
                    </span>
                  )}
                </button>
                <button type="button" onClick={handleCalculateFare}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                  Calculate Fare
                </button>
                <button type="submit" disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                  {loading ? 'Submitting...' : 'Offer Ride'}
                </button>
              </div>

              {/* Selected preference tags */}
              {selectedCount > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {preferenceOptions.filter(p => preferences[p.name]).map(p => (
                    <span key={p.name} className={`text-xs font-medium px-3 py-1 rounded-full border ${tagColors[p.color]}`}>
                      {p.label}
                    </span>
                  ))}
                </div>
              )}

            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 py-3 px-6">
            <div className="flex justify-center space-x-8 text-gray-700 font-medium">
              <Link href="/" className="cursor-pointer hover:text-green-600">Home</Link>
              <Link href="/ClassSchedule" className="cursor-pointer hover:text-green-600">Class Schedule</Link>
              <span className="cursor-pointer hover:text-green-600">Contact Us</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">

            {/* Modal Header */}
            <div className="bg-green-600 text-white py-4 px-6 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold">Ride Preferences</h2>
              <button onClick={() => setShowPreferencesModal(false)}
                className="text-white hover:text-gray-200 text-2xl font-bold leading-none">&times;</button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-5">Select tags to help passengers find a comfortable ride match.</p>
              <div className="space-y-3">
                {preferenceOptions.map(({ name, label, desc }) => (
                  <label key={name}
                    className={`flex items-center gap-4 p-3 rounded-lg border-2 cursor-pointer transition-all ${preferences[name] ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="checkbox" name={name} checked={preferences[name]}
                      onChange={handlePreferenceChange}
                      className="w-5 h-5 accent-green-600"
                    />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                Save Preferences
              </button>
              <button
                onClick={() => {
                  setPreferences({ femaleOnly: false, noSmoking: false, quietRide: false, musicOk: false, petsAllowed: false, noEating: false, acRequired: false, studentOnly: false });
                  setShowPreferencesModal(false);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200">
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
