'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ClassSchedulePage() {
  const [formData, setFormData] = useState({
    studentName: '',
    day: 'Monday',
    startTime: '',
    endTime: '',
    origin: '',
    destination: 'BRAC University',
    seats: 1,
    vehicleType: 'Car',
  });

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const parseApiResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const rawText = await response.text();
      throw new Error(`Server returned non-JSON response (${response.status}). ${rawText.slice(0, 120)}`);
    }

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data?.message || `Request failed with status ${response.status}`);
    }

    return data;
  };

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedule');
      const data = await parseApiResponse(response);
      setSchedules(data.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await parseApiResponse(response);
      console.log('Schedule response:', data);

      setMessage('Schedule posted successfully!');
      fetchSchedules();
      setFormData({
        studentName: '',
        day: 'Monday',
        startTime: '',
        endTime: '',
        origin: '',
        destination: 'BRAC University',
        seats: 1,
        vehicleType: 'Car',
      });
    } catch (error) {
      console.error('Schedule submission error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, update) => {
    try {
      const response = await fetch('/api/schedule', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...update }),
      });

      await parseApiResponse(response);
      fetchSchedules();
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-green-600 text-white py-4 px-6">
          <h1 className="text-2xl font-bold text-center">GoRide - Class Schedule</h1>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Post Your Class Schedule</h2>
          {message && (
            <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <select
                name="day"
                value={formData.day}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
              >
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 text-gray-900"
                required
              />
            </div>
            {/* New fields for auto-posting ride */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats (for auto-ride)</label>
              <input
                type="number"
                name="seats"
                min="1"
                max="8"
                value={formData.seats}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type (for auto-ride)</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
              >
                <option>Car</option>
                <option>Motorcycle</option>
                <option>Bus</option>
                <option>Van</option>
                <option>Micro</option>
                <option>Bike</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                {loading ? 'Posting...' : 'Post Schedule'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Schedule</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Day</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Class Time</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Route</th>
                    <th className="py-2 px-4 border-b text-center text-sm font-semibold text-gray-700">Auto Ride</th>
                    <th className="py-2 px-4 border-b text-center text-sm font-semibold text-gray-700">Keep Recurring</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-sm text-gray-900">{s.day}</td>
                      <td className="py-2 px-4 border-b text-sm text-gray-900">{s.startTime} - {s.endTime}</td>
                      <td className="py-2 px-4 border-b text-sm text-gray-900">{s.origin} ➔ {s.destination}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          onClick={() => toggleStatus(s._id, { autoRide: !s.autoRide })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            s.autoRide ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              s.autoRide ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          onClick={() => toggleStatus(s._id, { recurring: !s.recurring })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            s.recurring ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              s.recurring ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {schedules.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-500">No schedules posted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 bg-gray-50 py-3 px-6">
          <div className="flex justify-center space-x-8 text-gray-700 font-medium">
            <Link href="/OfferRide" className="cursor-pointer hover:text-green-600">Home</Link>
            <Link href="/ClassSchedule" className="cursor-pointer hover:text-green-600 text-green-600">Class Schedule</Link>
            <span className="cursor-pointer hover:text-green-600">Contact Us</span>
          </div>
        </div>
      </div>
    </div>
  );
}
