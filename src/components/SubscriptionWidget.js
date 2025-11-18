// app/components/SubscriptionWidget.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function SubscriptionWidget() {
  const router = useRouter();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data } = await api.get('/subscription/status');
      if (data.success) {
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Fetch subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data } = await api.post('/stripe/create-portal-session');
      if (data.success && data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open billing portal');
    } finally {
      setPortalLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.')) {
      return;
    }

    setCancelLoading(true);
    try {
      const { data } = await api.post('/subscription/cancel');
      if (data.success) {
        alert('Subscription canceled successfully');
        fetchSubscription();
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert(error.response?.data?.message || 'Failed to cancel subscription');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (!subscription) return null;

  const isPro = subscription.plan === 'pro';
  const isFree = subscription.plan === 'free';
  const isCanceled = subscription.subscriptionStatus === 'canceled';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Subscription</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          isPro ? 'bg-purple-100 text-purple-800' :
          isFree ? 'bg-gray-100 text-gray-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {subscription.planName}
        </span>
      </div>

      <div className="space-y-4">
        {/* Token usage */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Image Operations</span>
            <span className="font-semibold text-gray-900">
              {isPro ? 'Unlimited' : `${subscription.tokensImages} left`}
            </span>
          </div>
          {!isPro && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${Math.min((subscription.tokensImages / (subscription.plan === 'free' ? 10 : 300)) * 100, 100)}%`
                }}
              ></div>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Text Generations</span>
            <span className="font-semibold text-gray-900">
              {isPro ? 'Unlimited' : `${subscription.tokensText} left`}
            </span>
          </div>
          {!isPro && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${Math.min((subscription.tokensText / (subscription.plan === 'free' ? 3 : 100)) * 100, 100)}%`
                }}
              ></div>
            </div>
          )}
        </div>

        {/* Reset date */}
        {!isPro && subscription.resetDate && (
          <div className="text-sm text-gray-600">
            Resets: {new Date(subscription.resetDate).toLocaleDateString()}
          </div>
        )}

        {/* Subscription end date for canceled */}
        {isCanceled && subscription.subscriptionEndDate && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              Your subscription is canceled. Access until{' '}
              {new Date(subscription.subscriptionEndDate).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-4">
          {isFree ? (
            <button
              onClick={() => router.push('/pricing')}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Upgrade Plan
            </button>
          ) : (
            <>
              <button
                onClick={handleManageSubscription}
                disabled={portalLoading}
                className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                {portalLoading ? 'Loading...' : 'Manage Billing'}
              </button>
              {!isCanceled && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelLoading}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {cancelLoading ? 'Canceling...' : 'Cancel'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}