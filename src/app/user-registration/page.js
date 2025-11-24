"use client"
import React from 'react';
import { Link } from 'react-router-dom';
import RegistrationHeader from '../../components/user-registration/RegistrationHeader';
import RegistrationForm from '../../components/user-registration/RegistrationForm';
import SocialRegistration from '../../components/user-registration/SocialRegistration';
import TrustSignals from '../../components/user-registration/TrustSignals';
import Icon from '../../components/AppIcon';

const UserRegistration = () => {
  return (
    <div className="min-h-screen bg-background">
      <RegistrationHeader />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="UserPlus" size={32} color="var(--color-primary)" />
            </div>
            <h1 className="text-fluid-2xl font-semibold text-foreground mb-2">
              Create Your Account
            </h1>
            <p className="text-muted-foreground">
              Join thousands of users who trust ToolSuite Pro for their file processing needs
            </p>
          </div>
          <div className="bg-card rounded-lg shadow-resting border border-border p-6 sm:p-8 mb-6">
            <RegistrationForm />
          </div>
          <div className="bg-card rounded-lg shadow-resting border border-border p-6 sm:p-8 mb-6">
            <SocialRegistration />
          </div>
          <div className="mb-6">
            <TrustSignals />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/user-login"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>
      <footer className="bg-card border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date()?.getFullYear()} ToolSuite Pro. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 mt-2">
              <Link to="/help" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
              <Link to="/support" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Support
              </Link>
              <Link to="/status" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                System Status
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserRegistration;