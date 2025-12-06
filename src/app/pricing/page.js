"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';

const PLANS = {
  free: {
    name: 'Free',
    priceUSD: 0,
    priceBDT: 0,
    tokensImages: 10,
    tokensText: 3,
    features: [
      '10 image operations/month',
      '3 AI text generations/month',
      'Low-resolution exports only',
      'No access to premium tools'
    ]
  },
  basic: {
    name: 'Basic',
    priceMonthlyUSD: 9,
    priceYearlyUSD: 99,
    priceMonthlyBDT: 990,
    priceYearlyBDT: 10890,
    tokensImages: 300,
    tokensText: 100,
    features: [
      '300 image operations/month',
      '100 AI text generations/month',
      'High-resolution, no watermark',
      'Access to PDF chat & summaries',
      'Email support'
    ],
    popular: true
  },
  pro: {
    name: 'Pro',
    priceMonthlyUSD: 29,
    priceYearlyUSD: 199,
    priceMonthlyBDT: 3190,
    priceYearlyBDT: 21890,
    tokensImages: 'Unlimited',
    tokensText: 'Unlimited',
    features: [
      'Unlimited image operations',
      'Unlimited AI text generations',
      'Batch processing support',
      'Priority queue (faster AI)',
      'API access for automation'
    ]
  }
};

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [currency, setCurrency] = useState('usd');
  const [loading, setLoading] = useState(null);

  const handleSelectPlan = async (planKey) => {
    if (!user) {
      router.push('/auth/signin?redirect=/pricing');
      return;
    }

    if (planKey === 'free') {
      return;
    }

    setLoading(planKey);

    try {
      const { data } = await api.post('/stripe/create-checkout-session', {
        plan: planKey,
        billingCycle,
        currency
      });

      if (data.success && data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.response?.data?.message || 'Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  const getPrice = (plan, cycle) => {
    if (plan === 'free') return currency === 'usd' ? '$0' : '৳0';
    
    const planData = PLANS[plan];
    const key = `price${cycle === 'yearly' ? 'Yearly' : 'Monthly'}${currency.toUpperCase()}`;
    const price = planData[key];
    
    const symbol = currency === 'usd' ? '$' : '৳';
    const perPeriod = cycle === 'yearly' ? '/year' : '/month';
    
    if (cycle === 'yearly') {
      const monthlyEquiv = price / 12;
      return `${symbol}${price}${perPeriod} (${symbol}${monthlyEquiv.toFixed(0)}/mo)`;
    }
    
    return `${symbol}${price}${perPeriod}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Select the perfect plan for your needs
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors relative ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrency('usd')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currency === 'usd'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('bdt')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currency === 'bdt'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              BDT (৳)
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(PLANS).map(([key, plan]) => (
            <div
              key={key}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-blue-600 relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-600 text-white text-center py-2 font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    {getPrice(key, billingCycle)}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(key)}
                  disabled={loading === key || (user && user.plan === key)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    user && user.plan === key
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  } ${loading === key ? 'opacity-50 cursor-wait' : ''}`}
                >
                  {loading === key
                    ? 'Processing...'
                    : user && user.plan === key
                    ? 'Current Plan'
                    : key === 'free'
                    ? 'Free Forever'
                    : 'Get Started'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-gray-600">
          <p>All plans include 24/7 customer support</p>
          <p className="mt-2">No refunds. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
}