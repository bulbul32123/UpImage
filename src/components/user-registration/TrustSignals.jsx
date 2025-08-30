"use client"
import React from 'react';
import Icon from '../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      text: 'SSL Encrypted',
      description: 'Your data is protected'
    },
    {
      icon: 'Lock',
      text: 'Privacy Protected',
      description: 'We never share your information'
    },
    {
      icon: 'CheckCircle',
      text: 'GDPR Compliant',
      description: 'Full data protection compliance'
    }
  ];

  const policies = [
    {
      label: 'Privacy Policy',
      href: '/privacy-policy'
    },
    {
      label: 'Terms of Service',
      href: '/terms-of-service'
    },
    {
      label: 'Cookie Policy',
      href: '/cookie-policy'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Trust Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustFeatures?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2 text-center sm:text-left">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name={feature?.icon} size={16} color="var(--color-success)" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{feature?.text}</p>
              <p className="text-xs text-muted-foreground">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 p-3 bg-muted/50 rounded-lg border border-border">
        <Icon name="ShieldCheck" size={20} color="var(--color-success)" />
        <span className="text-sm text-foreground font-medium">
          256-bit SSL Security
        </span>
      </div>
      {/* Policy Links */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-2">
          By creating an account, you agree to our
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {policies?.map((policy, index) => (
            <a
              key={index}
              href={policy?.href}
              className="text-xs text-primary hover:text-primary/80 transition-colors underline"
            >
              {policy?.label}
            </a>
          ))}
        </div>
      </div>
      {/* Additional Trust Message */}
      <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="Users" size={16} color="var(--color-primary)" />
          <span className="text-sm font-medium text-primary">
            Join 50,000+ users
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Trusted by professionals worldwide for secure file processing
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;