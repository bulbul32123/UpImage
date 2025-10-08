"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '../../components/AppIcon';
import AccountDetailsTab from '../../components/user-profile-management/AccountDetailsTab';
import SubscriptionTab from '../../components/user-profile-management/SubscriptionTab';
import UsageAnalyticsTab from '../../components/user-profile-management/UsageAnalyticsTab';
import SecurityTab from '../../components/user-profile-management/SecurityTab';
import { useAuth } from '@/context/AuthContext';

const UserProfileManagement = () => {
  const [activeTab, setActiveTab] = useState('account');
  const { user, loading } = useAuth();
  const tabs = [
    {
      id: 'account',
      label: 'Account Details',
      icon: 'User',
      component: AccountDetailsTab
    },
    {
      id: 'subscription',
      label: 'Subscription & Billing',
      icon: 'CreditCard',
      component: SubscriptionTab
    },
    {
      id: 'analytics',
      label: 'Usage Analytics',
      icon: 'BarChart3',
      component: UsageAnalyticsTab
    },
    {
      id: 'security',
      label: 'Security Settings',
      icon: 'Shield',
      component: SecurityTab
    }
  ];

  const ActiveComponent = tabs?.find(tab => tab?.id === activeTab)?.component;
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Breadcrumb */}
      <div className="bg-card border-b border-border shadow-resting">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                href="/dashboard-overview"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
              <span className="text-foreground font-medium">Profile Settings</span>
            </nav>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <Link href="/dashboard-overview">
                <button className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="ArrowLeft" size={16} />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border shadow-resting p-6 sticky top-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={24} color="white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{user?.name}</h2>
                  <p className="text-sm text-muted-foreground">Pro Plan</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                  >
                    <Icon
                      name={tab?.icon}
                      size={18}
                      color={activeTab === tab?.id ? 'white' : 'var(--color-muted-foreground)'}
                    />
                    <span className="text-sm font-medium">{tab?.label}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-sm font-medium text-foreground mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Files Processed</span>
                    <span className="text-xs font-medium text-foreground">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Storage Used</span>
                    <span className="text-xs font-medium text-foreground">3.2 GB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Member Since</span>
                    <span className="text-xs font-medium text-foreground">Jan 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden mb-6">
              <div className="bg-card rounded-lg border border-border shadow-resting p-2">
                <div className="flex space-x-1 overflow-x-auto">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                      <Icon
                        name={tab?.icon}
                        size={16}
                        color={activeTab === tab?.id ? 'white' : 'var(--color-muted-foreground)'}
                      />
                      <span className="hidden sm:inline">{tab?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Tab Header */}
              <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon
                      name={tabs?.find(tab => tab?.id === activeTab)?.icon}
                      size={20}
                      color="var(--color-primary)"
                    />
                  </div>
                  <div>
                    <h1 className="text-fluid-2xl font-semibold text-foreground">
                      {tabs?.find(tab => tab?.id === activeTab)?.label}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === 'account' && 'Manage your personal information and preferences'}
                      {activeTab === 'subscription' && 'View and manage your subscription and billing details'}
                      {activeTab === 'analytics' && 'Track your usage patterns and performance metrics'}
                      {activeTab === 'security' && 'Secure your account with advanced security settings'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Tab Content */}
              {ActiveComponent && <ActiveComponent user={user} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileManagement;