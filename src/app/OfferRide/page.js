import React from 'react';

export default function GoRidePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      {/* Main card */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white py-4 px-6">
          <h1 className="text-2xl font-bold">GoRide</h1>
        </div>

        {/* Offer A Ride section */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Offer A Ride</h2>
          <p className="text-gray-600 mb-6">Share your commute with fellow students</p>

          <div className="space-y-4">
            {/* Starting point */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starting Point (Origin)
              </label>
              <input
                type="text"
                placeholder="eg. Banani, 11/A Main St. Or BRAC University"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 text-gray-900"
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <input
                type="text"
                placeholder="eg. Gulshan, 11/A Main St. Or BRAC University"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 text-gray-900"
              />
            </div>

            {/* Date and Seats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white">
                  <option value="" disabled selected>Select seats</option>
                  <option>1 seat</option>
                  <option>2 seats</option>
                  <option>3 seats</option>
                  <option>4 seats</option>
                  <option>5+ seats</option>
                </select>
              </div>
            </div>

            {/* Time row - Time pickers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    defaultValue=""
                  />
                </div>
                <span className="text-gray-500 font-medium">to</span>
                <div className="flex-1">
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    defaultValue=""
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Select start and end time</p>
            </div>

            {/* Types of Vehicle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Types of Vehicle</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white">
                <option value="" disabled selected>Select vehicle type</option>
                <option>Car</option>
                <option>Micro</option>
                <option>Bike</option>
              </select>
            </div>

            {/* Preferences and Calculate Fare buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                Preferences
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                Calculate Fare
              </button>
            </div>
          </div>
        </div>

        {/* Footer navigation (Home, Class Schedule, Contact Us) */}
        <div className="border-t border-gray-200 bg-gray-50 py-3 px-6">
          <div className="flex justify-center space-x-8 text-gray-700 font-medium">
            <span className="cursor-pointer hover:text-green-600">Home</span>
            <span className="cursor-pointer hover:text-green-600">Class Schedule</span>
            <span className="cursor-pointer hover:text-green-600">Contact Us</span>
          </div>
        </div>
      </div>
    </div>
  );
}