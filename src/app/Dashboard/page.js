'use client';

import Header from '@/Components/Header';
import React, { useState, useEffect } from 'react';
import PreferencesModal from '@/Components/PreferencesModal';
import { preferenceOptions, nameToOption } from '@/lib/preferenceOptions';


export default function DashboardPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // filter preferences state
  const [filterPrefs, setFilterPrefs] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const toggleFilterPref = (pref) => {
    setFilterPrefs(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };
  const closeFilterModal = () => setShowFilterModal(false);

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    availableSeats: '',
    startTime: '',
    endTime: '',
    vehicleType: '',
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    fare: '',
    description: '',
    status: '',
  });

  // Fetch all rides on component mount
  useEffect(() => {
    fetchRides();
  }, []);

  const ridesToShow = filterPrefs.length > 0
    ? rides.filter(r =>
        Array.isArray(r.preferences) &&
        filterPrefs.every(p => r.preferences.includes(p))
      )
    : rides;

  const fetchRides = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/rides');
      const data = await response.json();

      if (data.success) {
        setRides(data.data);
        setMessage('');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error fetching rides: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (ride) => {
    const [startTime, endTime] = ride.time.split(' - ');
    setEditingId(ride._id);
    setEditFormData({
      origin: ride.origin,
      destination: ride.destination,
      date: ride.date.split('T')[0],
      availableSeats: ride.seats.toString(),
      startTime: startTime,
      endTime: endTime,
      vehicleType: ride.vehicleType,
      vehicleNumber: ride.vehicleNumber,
      driverName: ride.driverName,
      driverPhone: ride.driverPhone,
      fare: ride.fare.toString(),
      description: ride.description,
      status: ride.status,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateRide = async (id) => {
    try {
      const timeString = `${editFormData.startTime} - ${editFormData.endTime}`;
      const updateData = {
        origin: editFormData.origin.trim(),
        destination: editFormData.destination.trim(),
        date: new Date(editFormData.date),
        time: timeString,
        seats: parseInt(editFormData.availableSeats),
        vehicleType: editFormData.vehicleType,
        vehicleNumber: editFormData.vehicleNumber.trim(),
        driverName: editFormData.driverName.trim(),
        driverPhone: editFormData.driverPhone.trim(),
        fare: parseInt(editFormData.fare),
        description: editFormData.description.trim(),
        status: editFormData.status,
      };

      const response = await fetch(`/api/rides/${id}?t=${Date.now()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Ride updated successfully!');
        setEditingId(null);
        fetchRides();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error updating ride: ${error.message}`);
    }
  };

  const handleDeleteRide = async (id) => {
    if (!confirm('Are you sure you want to delete this ride?')) {
      return;
    }

    try {
      const response = await fetch(`/api/rides/${id}?t=${Date.now()}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Ride deleted successfully!');
        fetchRides();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error deleting ride: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({
      origin: '',
      destination: '',
      date: '',
      availableSeats: '',
      startTime: '',
      endTime: '',
      vehicleType: '',
      vehicleNumber: '',
      driverName: '',
      driverPhone: '',
      fare: '',
      description: '',
      status: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header/>
      <div className="flex-1 flex flex-col items-center p-4">
      {/* Main card */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white py-4 px-6">
          <h1 className="text-2xl font-bold">GoRide Dashboard</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Rides</h2>
          {/* filter controls */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowFilterModal(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Filter Preferences
            </button>
            {filterPrefs.length > 0 && (
              <>
                <div className="flex flex-wrap gap-2">
                  {filterPrefs.map(name => {
                    const opt = nameToOption[name];
                    if (!opt) return null;
                    const colorMap = {
                      pink: 'bg-pink-100 text-pink-800',
                      gray: 'bg-gray-100 text-gray-800',
                      blue: 'bg-blue-100 text-blue-800',
                      purple: 'bg-purple-100 text-purple-800',
                      yellow: 'bg-yellow-100 text-yellow-800',
                      orange: 'bg-orange-100 text-orange-800',
                      cyan: 'bg-cyan-100 text-cyan-800',
                      green: 'bg-green-100 text-green-800',
                    };
                    const clz = colorMap[opt.color] || colorMap.gray;
                    return (
                      <span
                        key={name}
                        className={`${clz} px-2 py-1 text-xs rounded-full flex items-center gap-1`}
                      >
                        {opt.label}
                      </span>
                    );
                  })}
                </div>
                <button
                  onClick={() => setFilterPrefs([])}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear
                </button>
              </>
            )}
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading rides...</p>
            </div>
          ) : rides.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No rides offered yet. Start by offering a ride!</p>
            </div>
          ) : ridesToShow.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No rides match the selected preferences.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ridesToShow.map((ride) => (
                <div key={ride._id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  {editingId === ride._id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Edit Ride</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                          <input
                            type="text"
                            name="origin"
                            value={editFormData.origin}
                            onChange={handleEditInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                          <input
                            type="text"
                            name="destination"
                            value={editFormData.destination}
                            onChange={handleEditInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            name="date"
                            value={editFormData.date}
                            onChange={handleEditInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
                          <input
                            type="number"
                            name="availableSeats"
                            value={editFormData.availableSeats}
                            onChange={handleEditInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <input
                              type="time"
                              name="startTime"
                              value={editFormData.startTime}
                              onChange={handleEditInputChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                            />
                          </div>
                          <span className="text-gray-500">to</span>
                          <div className="flex-1">
                            <input
                              type="time"
                              name="endTime"
                              value={editFormData.endTime}
                              onChange={handleEditInputChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                          <select
                            name="vehicleType"
                            value={editFormData.vehicleType}
                            onChange={handleEditInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                          >
                            <option value="">Select vehicle type</option>
                            <option value="Car">Car</option>
                            <option value="Micro">Micro</option>
                            <option value="Bike">Bike</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                          <input
                            type="text"
                            name="vehicleNumber"
                            value={editFormData.vehicleNumber}
                            onChange={handleEditInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                          <input
                            type="text"
                            name="driverName"
                            value={editFormData.driverName}
                            onChange={handleEditInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Driver Phone</label>
                          <input
                            type="tel"
                            name="driverPhone"
                            value={editFormData.driverPhone}
                            onChange={handleEditInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fare</label>
                          <input
                            type="number"
                            name="fare"
                            value={editFormData.fare}
                            onChange={handleEditInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            name="status"
                            value={editFormData.status}
                            onChange={handleEditInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                          >
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                          rows="3"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateRide(ride._id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Ride Display
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {ride.origin} → {ride.destination}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(ride.date).toLocaleDateString()} | {ride.time}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          ride.status === 'active' ? 'bg-green-100 text-green-800' :
                          ride.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          ride.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ride.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600">Seats</p>
                          <p className="font-semibold text-gray-800">{ride.seats}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Vehicle Type</p>
                          <p className="font-semibold text-gray-800">{ride.vehicleType}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Vehicle #</p>
                          <p className="font-semibold text-gray-800">{ride.vehicleNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Fare</p>
                          <p className="font-semibold text-gray-800">{ride.fare ? `৳${ride.fare}` : 'TBD'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600">Driver Name</p>
                          <p className="font-semibold text-gray-800">{ride.driverName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Phone</p>
                          <p className="font-semibold text-gray-800">{ride.driverPhone}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Description</p>
                          <p className="font-semibold text-gray-800">{ride.description || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditClick(ride)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRide(ride._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter modal for preferences */}
        <PreferencesModal
          show={showFilterModal}
          onClose={closeFilterModal}
          selectedPrefs={filterPrefs}
          togglePreference={toggleFilterPref}
        />
        {/* Footer navigation */}
        <div className="border-t border-gray-200 bg-gray-50 py-3 px-6">
          <div className="flex justify-center space-x-8 text-gray-700 font-medium">
            <span className="cursor-pointer hover:text-green-600">Home</span>
            <span className="cursor-pointer hover:text-green-600">Offer Ride</span>
            <span className="cursor-pointer hover:text-green-600">Contact Us</span>
          </div>
      </div>
        </div>
      </div>
    </div>
  );
}
