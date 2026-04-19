import React from 'react';
import { preferenceOptions } from '@/lib/preferenceOptions';

export default function PreferencesModal({ show, onClose, selectedPrefs, togglePreference }) {
  if (!show) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg w-11/12 max-w-2xl p-6 shadow-xl">
        <h3 className="text-2xl font-bold mb-6 text-center">Ride Preferences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {preferenceOptions.map((opt) => {
            const selected = selectedPrefs.includes(opt.name);
            const colorMap = {
              pink: 'border-pink-500 bg-pink-50',
              gray: 'border-gray-200 hover:border-gray-400 bg-gray-50',
              blue: 'border-blue-500 bg-blue-50',
              purple: 'border-purple-500 bg-purple-50',
              yellow: 'border-yellow-500 bg-yellow-50',
              orange: 'border-orange-500 bg-orange-50',
              cyan: 'border-cyan-500 bg-cyan-50',
              green: 'border-green-500 bg-green-50',
            };
            const baseClasses = 'cursor-pointer p-4 rounded-lg border-2 transition-colors flex items-start space-x-3';
            const specific = selected ? colorMap[opt.color] || 'border-gray-200 bg-gray-50' : 'border-gray-200 hover:border-gray-400';
            return (
              <div
                key={opt.name}
                onClick={() => togglePreference(opt.name)}
                className={`${baseClasses} ${specific}`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => togglePreference(opt.name)}
                  className="mt-1 h-4 w-4 text-green-600"
                />
                <div>
                  <p className="font-medium text-gray-800">{opt.label}</p>
                  <p className="text-sm text-gray-600">{opt.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
