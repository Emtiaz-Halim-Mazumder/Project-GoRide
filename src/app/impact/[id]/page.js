'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { use } from 'react';

export default function ImpactDashboard() {
  const router = useRouter();
  // In Next.js 15, params is a Promise, so we must unwrap it with React.use()
  const params = useParams();
  const id = params?.id;
  
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Animated values
  const [displayKm, setDisplayKm] = useState(0);
  const [displayMoney, setDisplayMoney] = useState(0);
  const [displayCo2, setDisplayCo2] = useState(0);
  const [displayPoints, setDisplayPoints] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchRide = async () => {
      try {
        const res = await fetch(`/api/rides/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setRide(data.data);
        } else {
          setError(data.error || 'Failed to load ride data');
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [id]);

  useEffect(() => {
    if (!ride) return;

    // Calculations based on the provided formulas
    const distance = ride.distanceKm || 0;
    const passengers = ride.seats || 1;
    
    // Money saved = total fare - per person fare
    const perPersonFare = ride.fare || 0;
    const totalFare = perPersonFare * passengers;
    const moneySaved = totalFare - perPersonFare;
    
    // CO2 Emission (g) = Distance (km) * Emission Factor (150g/km) * no of passengers (If solo)
    const emissionSolo = distance * 150 * passengers;
    
    // CO2 Emission after sharing ride (g) = (Distance (km) * Emission Factor (150g/km)) / no of passengers
    const emissionShared = (distance * 150) / passengers;
    
    // Reduced Carbon Emission (g) = CO2 Emission (g) - CO2 Emission after sharing ride (g)
    const reducedEmission = emissionSolo - emissionShared;
    
    // Points = 1 point per 150 grams CO2 saved
    const points = Math.floor(reducedEmission / 150);

    // Animation logic for numbers
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      
      setDisplayKm(distance * easeProgress);
      setDisplayMoney(moneySaved * easeProgress);
      setDisplayCo2(reducedEmission * easeProgress);
      setDisplayPoints(points * easeProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayKm(distance);
        setDisplayMoney(moneySaved);
        setDisplayCo2(reducedEmission);
        setDisplayPoints(points);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [ride]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 border-solid"></div>
        </div>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full border border-red-100">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-6">{error || 'Ride not found'}</p>
            <Link href="/Dashboard" className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center p-4 py-10">
        
        {/* Success Header Banner */}
        <div className="w-full max-w-5xl bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 mb-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
          </div>
          <div className="relative z-10">
            <div className="inline-block bg-white/20 p-3 rounded-full mb-4 backdrop-blur-sm border border-white/30">
              <span className="text-4xl">🎉</span>
            </div>
            <h1 className="text-3xl font-extrabold mb-2">Ride Ended Successfully!</h1>
            <p className="text-lg text-green-50 max-w-2xl mx-auto">
              You shared your {ride.distanceKm} km commute from {ride.origin.split(',')[0]} to {ride.destination.split(',')[0]}. Check out the positive impact you've made!
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Money Saved Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-b-4 border-yellow-400 transform transition duration-500 hover:scale-105 hover:shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <span className="text-xs font-bold text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full uppercase tracking-wider">Financial</span>
            </div>
            <h3 className="text-gray-500 font-medium text-sm mb-1">Potential Money Saved</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-gray-900">৳{Math.round(displayMoney).toLocaleString()}</span>
            </div>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, (displayMoney / 500) * 100)}%`, transition: 'width 2s ease-out' }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">By sharing your fuel costs with {ride.seats} passengers</p>
          </div>

          {/* CO2 Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-b-4 border-green-500 transform transition duration-500 hover:scale-105 hover:shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-100 p-3 rounded-xl text-green-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">Environment</span>
            </div>
            <h3 className="text-gray-500 font-medium text-sm mb-1">CO₂ Emission Reduced</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-gray-900">{(displayCo2 / 1000).toFixed(2)}</span>
              <span className="text-lg font-bold text-gray-500">kg</span>
            </div>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (displayCo2 / 5000) * 100)}%`, transition: 'width 2s ease-out' }}></div>
            </div>
            <p className="text-xs text-green-600 font-medium mt-2">≈ Equivalent to planting {(displayCo2 / 21000).toFixed(2)} trees 🌳</p>
          </div>

          {/* Points Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-b-4 border-blue-500 transform transition duration-500 hover:scale-105 hover:shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              </div>
              <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wider">Rewards</span>
            </div>
            <h3 className="text-gray-500 font-medium text-sm mb-1">Impact Points Earned</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-blue-600">+{Math.round(displayPoints)}</span>
              <span className="text-lg font-bold text-gray-500">pts</span>
            </div>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (displayPoints / 50) * 100)}%`, transition: 'width 2s ease-out' }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Added to your Profile Dashboard!</p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link href="/Dashboard" className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm">
            Go to Dashboard
          </Link>
          <Link href="/profile" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-md flex items-center gap-2">
            View My Profile <span className="text-xl">➔</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
