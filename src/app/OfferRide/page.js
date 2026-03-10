'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Script from 'next/script';
import Link from 'next/link';

const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const hasGoogleMapsKey = Boolean(mapsApiKey && mapsApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY');

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
  
  // Google Maps State
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [travelInfo, setTravelInfo] = useState(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  
  const mapRef = useRef(null);
  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);

  useEffect(() => {
    if (!hasGoogleMapsKey) {
      setMessage('Google Maps is not configured. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local.');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }

      if (typeof window !== 'undefined' && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(originInputRef.current);
        window.google.maps.event.clearInstanceListeners(destinationInputRef.current);
      }
    };
  }, [directionsRenderer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCalculateFare = () => {
    alert(`Fare calculation for: ${formData.origin} to ${formData.destination}`);
  };

  const handlePreferences = () => {
    alert('Preferences settings will open here');
  };

  const initMap = () => {
    if (typeof window !== 'undefined' && window.google && !map) {
      const google = window.google;
      
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: 23.8103, lng: 90.4125 }, // Dhaka coordinates
        zoom: 12,
        mapTypeControl: false,
      });

      const newRenderer = new google.maps.DirectionsRenderer();
      newRenderer.setMap(newMap);
      
      const newService = new google.maps.DirectionsService();

      setMap(newMap);
      setDirectionsRenderer(newRenderer);
      setDirectionsService(newService);

      // Autocomplete setup
      const originAutocomplete = new google.maps.places.Autocomplete(originInputRef.current);
      const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInputRef.current);

      originAutocomplete.addListener('place_changed', () => {
        const place = originAutocomplete.getPlace();
        if (place.formatted_address) {
          setFormData(prev => ({ ...prev, origin: place.formatted_address }));
        }
      });

      destinationAutocomplete.addListener('place_changed', () => {
        const place = destinationAutocomplete.getPlace();
        if (place.formatted_address) {
          setFormData(prev => ({ ...prev, destination: place.formatted_address }));
        }
      });
      
      setIsApiLoaded(true);
    }
  };

  const handleShowRoute = () => {
    if (!formData.origin || !formData.destination) {
      alert('Please enter both origin and destination');
      return;
    }

    if (!directionsService || !directionsRenderer) {
      alert('Google Maps API is still loading...');
      return;
    }

    directionsService.route(
      {
        origin: formData.origin,
        destination: formData.destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: window.google.maps.TrafficModel.BEST_GUESS,
        },
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          
          const route = result.routes[0].legs[0];
          setTravelInfo({
            distance: route.distance.text,
            duration: route.duration.text,
            durationInTraffic: route.duration_in_traffic ? route.duration_in_traffic.text : null,
          });
        } else {
          alert('Could not find route: ' + status);
        }
      }
    );
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response from server:', data);
      if (!data.success) {
        throw new Error(data.message || 'Failed to create ride');
      }

      setMessage('Ride offered successfully!');
      setFormData({
        origin: '',
        destination: '',
        date: '',
        availableSeats: '',
        startTime: '',
        endTime: '',
        vehicleType: '',
      });
      if (directionsRenderer) {
        directionsRenderer.setDirections({ routes: [] });
      }
      setTravelInfo(null);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {hasGoogleMapsKey && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places`}
          onLoad={initMap}
          onError={() => setMessage('Failed to load Google Maps. Check your API key and restrictions.')}
        />
      )}
      <div className="flex-1 flex flex-col items-center p-4">
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

          {/* Message Display */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Starting point */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starting Point (Origin)
              </label>
              <input
                ref={originInputRef}
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
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
                ref={destinationInputRef}
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
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
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
                <select 
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleInputChange}
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

            {/* Time row - Time pickers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
                <span className="text-gray-500 font-medium">to</span>
                <div className="flex-1">
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Select start and end time</p>
            </div>

            {/* Types of Vehicle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Types of Vehicle</label>
              <select 
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white">
                <option value="">Select vehicle type</option>
                <option value="Car">Car</option>
                <option value="Micro">Micro</option>
                <option value="Bike">Bike</option>
              </select>
            </div>

            {/* Preferences and Calculate Fare buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                type="button"
                onClick={handlePreferences}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Preferences
              </button>
              <button 
                type="button"
                onClick={handleCalculateFare}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Calculate Fare
              </button>
              <button 
                type="button"
                onClick={handleShowRoute}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Show Fastest Route
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                {loading ? 'Submitting...' : 'Offer Ride'}
              </button>
            </div>
          </form>

          {/* Map and Route Info */}
          <div className="mt-8 space-y-4">
            {travelInfo && (
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex flex-wrap gap-6 justify-around text-indigo-900 font-medium">
                <div>Distance: <span className="font-bold">{travelInfo.distance}</span></div>
                <div>Est. Time: <span className="font-bold">{travelInfo.duration}</span></div>
                {travelInfo.durationInTraffic && (
                  <div>With Traffic: <span className="font-bold text-red-600">{travelInfo.durationInTraffic}</span></div>
                )}
              </div>
            )}
            <div className="relative w-full h-96 rounded-xl border-2 border-gray-200 shadow-inner overflow-hidden" style={{ minHeight: '400px' }}>
              <div
                ref={mapRef}
                className="w-full h-full"
              />
              {!isApiLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                  Loading Google Maps...
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 italic text-center">
              Routes are calculated based on current Dhaka traffic conditions.
            </p>
          </div>
        </div>


        {/* Footer navigation (Home, Class Schedule, Contact Us) */}
        <div className="border-t border-gray-200 bg-gray-50 py-3 px-6">
          <div className="flex justify-center space-x-8 text-gray-700 font-medium">
            <Link href="/" className="cursor-pointer hover:text-green-600">Home</Link>
            <Link href="/ClassSchedule" className="cursor-pointer hover:text-green-600">Class Schedule</Link>
            <span className="cursor-pointer hover:text-green-600">Contact Us</span>
          </div>
      </div>
        </div>
      </div>
    </div>
  );
}
