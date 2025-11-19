import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export const PLANS = {
  free: {
    name: 'Free',
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
    tokensImages: 300,
    tokensText: 100,
    priceMonthlyUSD: 9,
    priceYearlyUSD: 99,
    priceMonthlyBDT: 990,
    priceYearlyBDT: 10890,
    priceIdMonthlyUSD: process.env.STRIPE_BASIC_MONTHLY_USD_PRICE_ID,
    priceIdYearlyUSD: process.env.STRIPE_BASIC_YEARLY_USD_PRICE_ID,
    priceIdMonthlyBDT: process.env.STRIPE_BASIC_MONTHLY_BDT_PRICE_ID,
    priceIdYearlyBDT: process.env.STRIPE_BASIC_YEARLY_BDT_PRICE_ID,
    features: [
      '300 image operations/month',
      '100 AI text generations/month',
      'High-resolution, no watermark',
      'Access to PDF chat & summaries',
      'Email support'
    ]
  },
  pro: {
    name: 'Pro',
    tokensImages: -1, 
    tokensText: -1,
    priceMonthlyUSD: 29,
    priceYearlyUSD: 199,
    priceMonthlyBDT: 3190,
    priceYearlyBDT: 21890,
    priceIdMonthlyUSD: process.env.STRIPE_PRO_MONTHLY_USD_PRICE_ID,
    priceIdYearlyUSD: process.env.STRIPE_PRO_YEARLY_USD_PRICE_ID,
    priceIdMonthlyBDT: process.env.STRIPE_PRO_MONTHLY_BDT_PRICE_ID,
    priceIdYearlyBDT: process.env.STRIPE_PRO_YEARLY_BDT_PRICE_ID,
    features: [
      'Unlimited image operations',
      'Unlimited AI text generations',
      'Batch processing support',
      'Priority queue (faster AI responses)',
      'API access for automation'
    ]
  }
};

export function getPriceId(plan, billingCycle, currency = 'USD') {
  if (plan === 'free') return null;
  
  const planConfig = PLANS[plan];
  if (!planConfig) return null;
  
  const key = `priceId${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}${currency}`;
  return planConfig[key];
}
export function getPlanFromPriceId(priceId) {
  for (const [planKey, planConfig] of Object.entries(PLANS)) {
    if (planKey === 'free') continue;
    
    const priceIds = [
      planConfig.priceIdMonthlyUSD,
      planConfig.priceIdYearlyUSD,
      planConfig.priceIdMonthlyBDT,
      planConfig.priceIdYearlyBDT
    ];
    
    if (priceIds.includes(priceId)) {
      return {
        plan: planKey,
        billingCycle: priceId.includes('Yearly') ? 'yearly' : 'monthly'
      };
    }
  }
  return null;
}