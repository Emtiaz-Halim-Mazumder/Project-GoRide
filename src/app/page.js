'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/Components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation Bar */}
      
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
              GoRide
            </div>
          </div>
          <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <a href="#features" className="hover:text-green-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-green-600 transition">How It Works</a>
            <a href="#contact" className="hover:text-green-600 transition">Contact</a>
          </div>
          <div className="flex space-x-3">
            <Link href="/OfferRide">
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition">
                Offer Ride
              </button>
            </Link>

            <Link href="/verification">
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition">
                Verification
             </button>
            </Link>

            <Link href="/ClassSchedule">
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition">
                Class Schedule
             </button>
            </Link>

            <Link href="/Dashboard">
              <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded-lg transition">
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Share Your Commute,<br />
          <span className="text-green-600">Save Money</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          GoRide is a smart carpool matching platform for students. Share rides with fellow students, reduce transportation costs, and build a sustainable community.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/OfferRide">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition shadow-lg">
              Start Offering Rides
            </button>
          </Link>
          <Link href="/FindRide">
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 px-8 rounded-lg text-lg transition">
              Find a Ride
            </button>
          </Link>
          
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Why Choose GoRide?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4">
                💰
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Save Money</h3>
              <p className="text-gray-700">
                Split transportation costs with fellow students and reduce your commute expenses significantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4">
                🌍
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Eco-Friendly</h3>
              <p className="text-gray-700">
                Reduce carbon emissions by sharing rides. Together we can build a more sustainable future.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4">
                🤝
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Build Community</h3>
              <p className="text-gray-700">
                Connect with like-minded students, make new friends, and strengthen your student community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-700">Create your GoRide account and complete your profile</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Offer or Find</h3>
              <p className="text-gray-700">Offer a ride or find available rides matching your route</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-700">Connect with other riders and confirm your arrangement</p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ride Together</h3>
              <p className="text-gray-700">Enjoy your journey and save money while you travel</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <p className="text-lg">Active Students</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <p className="text-lg">Rides Shared</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">300+</div>
              <p className="text-lg">Money Saved</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <p className="text-lg">Routes Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Share Your Ride?</h2>
        <p className="text-xl text-gray-600 mb-8">Join thousands of students already saving money and helping the environment</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/OfferRide">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition shadow-lg">
              Offer a Ride
            </button>
          </Link>
          <Link href="/Dashboard">
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 px-8 rounded-lg text-lg transition">
              View Dashboard
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">GoRide</h4>
              <p>Making student commuting affordable and sustainable.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-500 transition">Offer Ride</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Dashboard</a></li>
                <li><a href="#" className="hover:text-green-500 transition">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-500 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-green-500 transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>Email: info@goride.com</li>
                <li>Phone: +880-1234-567890</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p>&copy; 2024 GoRide. All rights reserved. | Made for Students, By Students</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
