"use client"
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';


const SocialRegistration = () => {
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState(null);

  const socialProviders = [
    {
      name: 'Google',
      icon: 'Chrome',
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-white'
    },
    {
      name: 'Microsoft',
      icon: 'Square',
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    }
  ];

  const handleSocialLogin = async (provider) => {
    setLoadingProvider(provider?.name);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`${provider?.name} registration successful`);
      
      navigate('/dashboard-overview');
    } catch (error) {
      console.error(`${provider?.name} registration failed:`, error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialProviders?.map((provider) => (
          <Button
            key={provider?.name}
            variant="outline"
            onClick={() => handleSocialLogin(provider)}
            loading={loadingProvider === provider?.name}
            disabled={loadingProvider !== null}
            iconName={provider?.icon}
            iconPosition="left"
            className="justify-center"
          >
            {loadingProvider === provider?.name 
              ? `Connecting...` 
              : `Continue with ${provider?.name}`
            }
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SocialRegistration;