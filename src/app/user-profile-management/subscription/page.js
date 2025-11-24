"use client"
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import React, { useState } from 'react';

const Subscription = () => {
    const [currentPlan, setCurrentPlan] = useState('pro');
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const plans = [
        {
            id: 'free',
            name: 'Free',
            price: { monthly: 0, yearly: 0 },
            description: 'Perfect for trying out our tools',
            features: [
                '10 image processing operations/month',
                '5 PDF operations/month',
                '3 file conversions/month',
                'Basic support',
                '100MB storage'
            ],
            limits: {
                images: 10,
                pdfs: 5,
                conversions: 3,
                storage: '100MB'
            },
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            price: { monthly: 29, yearly: 290 },
            description: 'Best for professionals and small teams',
            features: [
                '500 image processing operations/month',
                '200 PDF operations/month',
                '100 file conversions/month',
                'Priority support',
                '10GB storage',
                'Advanced analytics',
                'API access'
            ],
            limits: {
                images: 500,
                pdfs: 200,
                conversions: 100,
                storage: '10GB'
            },
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: { monthly: 99, yearly: 990 },
            description: 'For large teams and organizations',
            features: [
                'Unlimited operations',
                'Unlimited storage',
                'Dedicated support',
                'Custom integrations',
                'Advanced security',
                'Team management',
                'SLA guarantee'
            ],
            limits: {
                images: 'Unlimited',
                pdfs: 'Unlimited',
                conversions: 'Unlimited',
                storage: 'Unlimited'
            },
            popular: false
        }
    ];

    const billingHistory = [
        {
            id: 1,
            date: '2024-08-01',
            amount: 29.00,
            status: 'paid',
            plan: 'Pro Monthly',
            invoice: 'INV-2024-001'
        },
        {
            id: 2,
            date: '2024-07-01',
            amount: 29.00,
            status: 'paid',
            plan: 'Pro Monthly',
            invoice: 'INV-2024-002'
        },
        {
            id: 3,
            date: '2024-06-01',
            amount: 29.00,
            status: 'paid',
            plan: 'Pro Monthly',
            invoice: 'INV-2024-003'
        },
        {
            id: 4,
            date: '2024-05-01',
            amount: 29.00,
            status: 'paid',
            plan: 'Pro Monthly',
            invoice: 'INV-2024-004'
        }
    ];

    const currentUsage = {
        images: { used: 234, limit: 500 },
        pdfs: { used: 89, limit: 200 },
        conversions: { used: 45, limit: 100 },
        storage: { used: 3.2, limit: 10, unit: 'GB' }
    };

    const handlePlanChange = (planId) => {
        setSelectedPlan(planId);
        setShowUpgradeModal(true);
    };

    const confirmPlanChange = () => {
        setCurrentPlan(selectedPlan);
        setShowUpgradeModal(false);
        setSelectedPlan(null);
    };

    const getUsagePercentage = (used, limit) => {
        if (limit === 'Unlimited') return 0;
        return Math.min((used / limit) * 100, 100);
    };

    const getUsageColor = (percentage) => {
        if (percentage >= 90) return 'bg-error';
        if (percentage >= 75) return 'bg-warning';
        return 'bg-success';
    };

    const formatDate = (dateString) => {
        return new Date(dateString)?.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="col-span-2 lg:col-span-3">
             <div className="pb-6">
        <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon
                name={"CreditCard"}
                size={20}
                color="var(--color-primary)"
              />
            </div>
            <div>
              <h1 className="text-fluid-2xl font-semibold text-foreground">
              Subscription & Billing
              </h1>
              <p className="text-sm text-muted-foreground">
              View and manage your subscription and billing details
              </p>
            </div>
          </div>
        </div>
      </div>
            <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Current Plan</h3>
                    <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-success/10 text-success text-sm font-medium rounded-full">
                            Active
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                                <Icon name="Crown" size={24} color="white" />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-foreground">
                                    {plans?.find(p => p?.id === currentPlan)?.name} Plan
                                </h4>
                                <p className="text-muted-foreground">
                                    ${plans?.find(p => p?.id === currentPlan)?.price?.[billingCycle]}/{billingCycle === 'monthly' ? 'month' : 'year'}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            {plans?.find(p => p?.id === currentPlan)?.description}
                        </p>
                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => handlePlanChange('enterprise')}>
                                Upgrade Plan
                            </Button>
                            <Button variant="ghost" size="sm"  className="max-lg:hidden" >
                                <Icon name="Download" size={16} className="mr-2 " />
                                Download Invoice
                            </Button>
                            <Button variant="ghost" size="sm" className="lg:hidden">
                                <Icon name="Download" size={16} className="mr-2" />Invoice
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h5 className="text-sm font-medium text-foreground mb-3">Next Billing Date</h5>
                        <p className="text-lg font-semibold text-foreground mb-1">September 1, 2024</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Your subscription will automatically renew
                        </p>
                        <Button variant="outline" size="sm">
                            <Icon name="CreditCard" size={16} className="mr-2" />
                            Update Payment Method
                        </Button>
                    </div>
                </div>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                <h3 className="text-lg font-semibold text-foreground mb-6">Current Usage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">Image Processing</span>
                            <span className="text-xs text-muted-foreground">
                                {currentUsage?.images?.used}/{currentUsage?.images?.limit}
                            </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(currentUsage?.images?.used, currentUsage?.images?.limit))}`}
                                style={{ width: `${getUsagePercentage(currentUsage?.images?.used, currentUsage?.images?.limit)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">PDF Operations</span>
                            <span className="text-xs text-muted-foreground">
                                {currentUsage?.pdfs?.used}/{currentUsage?.pdfs?.limit}
                            </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(currentUsage?.pdfs?.used, currentUsage?.pdfs?.limit))}`}
                                style={{ width: `${getUsagePercentage(currentUsage?.pdfs?.used, currentUsage?.pdfs?.limit)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">File Conversions</span>
                            <span className="text-xs text-muted-foreground">
                                {currentUsage?.conversions?.used}/{currentUsage?.conversions?.limit}
                            </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(currentUsage?.conversions?.used, currentUsage?.conversions?.limit))}`}
                                style={{ width: `${getUsagePercentage(currentUsage?.conversions?.used, currentUsage?.conversions?.limit)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">Storage</span>
                            <span className="text-xs text-muted-foreground">
                                {currentUsage?.storage?.used}{currentUsage?.storage?.unit}/{currentUsage?.storage?.limit}{currentUsage?.storage?.unit}
                            </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(currentUsage?.storage?.used, currentUsage?.storage?.limit))}`}
                                style={{ width: `${getUsagePercentage(currentUsage?.storage?.used, currentUsage?.storage?.limit)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border shadow-resting overflow-y-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Available Plans</h3>
                    <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${billingCycle === 'monthly' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${billingCycle === 'yearly' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Yearly
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-6">
                    {plans?.map((plan) => (
                        <div
                            key={plan?.id}
                            className={`relative border rounded-lg p-6 transition-all duration-200 ${plan?.popular
                                    ? 'border-primary shadow-elevated'
                                    : 'border-border hover:border-primary/50'
                                } ${currentPlan === plan?.id ? 'ring-2 ring-primary' : ''}`}
                        >
                            {plan?.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h4 className="text-xl font-semibold text-foreground mb-2">{plan?.name}</h4>
                                <div className="mb-2">
                                    <span className="text-3xl font-bold text-foreground">
                                        ${plan?.price?.[billingCycle]}
                                    </span>
                                    <span className="text-muted-foreground">
                                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{plan?.description}</p>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan?.features?.map((feature, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <Icon name="Check" size={16} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={currentPlan === plan?.id ? 'outline' : 'default'}
                                fullWidth
                                onClick={() => currentPlan !== plan?.id && handlePlanChange(plan?.id)}
                                disabled={currentPlan === plan?.id}
                            >
                                {currentPlan === plan?.id ? 'Current Plan' : `Switch to ${plan?.name}`}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Billing History</h3>
                    <Button variant="outline" size="sm">
                        <Icon name="Download" size={16} className="mr-2" />
                        Export All
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Invoice</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billingHistory?.map((bill) => (
                                <tr key={bill?.id} className="border-b border-border hover:bg-muted/50">
                                    <td className="py-3 px-4 text-sm text-foreground">{formatDate(bill?.date)}</td>
                                    <td className="py-3 px-4 text-sm text-foreground">{bill?.plan}</td>
                                    <td className="py-3 px-4 text-sm text-foreground">${bill?.amount?.toFixed(2)}</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                                            <Icon name="CheckCircle" size={12} className="mr-1" />
                                            Paid
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <Button variant="ghost" size="sm">
                                            <Icon name="Download" size={14} className="mr-1" />
                                            {bill?.invoice}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showUpgradeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-lg p-6 max-w-md w-full border border-border shadow-floating">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground">Confirm Plan Change</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowUpgradeModal(false)}
                            >
                                <Icon name="X" size={20} />
                            </Button>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-muted-foreground mb-4">
                                You&apos;re about to change from <strong>{plans?.find(p => p?.id === currentPlan)?.name}</strong> to{' '}
                                <strong>{plans?.find(p => p?.id === selectedPlan)?.name}</strong> plan.
                            </p>

                            <div className="bg-muted/50 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-foreground">New monthly cost:</span>
                                    <span className="text-lg font-semibold text-foreground">
                                        ${plans?.find(p => p?.id === selectedPlan)?.price?.monthly}/month
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Changes will take effect immediately. You&apos;ll be charged the prorated amount.
                                </p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => setShowUpgradeModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button fullWidth onClick={confirmPlanChange}>
                                Confirm Change
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscription;