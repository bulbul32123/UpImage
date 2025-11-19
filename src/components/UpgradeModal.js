// app/components/UpgradeModal.js
"use client";

import { useRouter } from 'next/navigation';

export default function UpgradeModal({ isOpen, onClose, currentPlan, tokensImages, tokensText }) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Out of Tokens
          </h2>
          <p className="text-gray-600">
            You've used all your available tokens for this month
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Current Plan:</span>
            <span className="font-semibold text-gray-900 capitalize">{currentPlan || 'Free'}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Image Tokens:</span>
            <span className="font-semibold text-gray-900">{tokensImages || 0} left</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Text Tokens:</span>
            <span className="font-semibold text-gray-900">{tokensText || 0} left</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">Upgrade to Basic for 300 image ops/month</span>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">Upgrade to Pro for unlimited access</span>
          </div>
        </div>

        <button
          onClick={handleUpgrade}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          View Pricing Plans
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 text-gray-600 hover:text-gray-800 py-2"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}