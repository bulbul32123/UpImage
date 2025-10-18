"use client"
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const RegistrationHeader = () => {
  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard-overview" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Wrench" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              ToolSuite Pro
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Already have an account?
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="LogIn"
              iconPosition="left"
              onClick={() => {
                console.log('Navigate to sign in');
              }}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RegistrationHeader;