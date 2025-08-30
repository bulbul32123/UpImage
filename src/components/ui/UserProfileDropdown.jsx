import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const UserProfileDropdown = ({ 
  user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    subscription: 'Pro Plan'
  },
  onLogout,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const profileMenuItems = [
    {
      label: 'Profile Settings',
      path: '/user-profile-management',
      icon: 'User',
      description: 'Manage your account settings'
    },
    {
      label: 'Subscription',
      path: '/subscription',
      icon: 'CreditCard',
      description: 'View and manage your plan'
    },
    {
      label: 'Usage Analytics',
      path: '/usage',
      icon: 'BarChart3',
      description: 'Track your usage statistics'
    },
    {
      label: 'Billing History',
      path: '/billing',
      icon: 'Receipt',
      description: 'View payment history'
    },
    {
      label: 'API Keys',
      path: '/api-keys',
      icon: 'Key',
      description: 'Manage API access'
    }
  ];

  const supportItems = [
    {
      label: 'Help Center',
      path: '/help',
      icon: 'HelpCircle'
    },
    {
      label: 'Contact Support',
      path: '/support',
      icon: 'MessageCircle'
    },
    {
      label: 'Feature Requests',
      path: '/feedback',
      icon: 'Lightbulb'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout?.();
  };

  const getInitials = (name) => {
    return name?.split(' ')?.map(word => word?.charAt(0))?.join('')?.toUpperCase()?.slice(0, 2);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className="rounded-full hover:bg-muted transition-colors"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user?.avatar ? (
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
            {getInitials(user?.name)}
          </div>
        )}
      </Button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-floating z-50 animate-scale-in">
          {/* User Info Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              {user?.avatar ? (
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-lg font-medium">
                  {getInitials(user?.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs text-success font-medium">
                    {user?.subscription}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-2">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => handleMenuItemClick('/dashboard-overview')}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
              >
                <Icon name="LayoutDashboard" size={16} color="var(--color-muted-foreground)" />
                <span className="text-xs text-foreground">Dashboard</span>
              </button>
              <button
                onClick={() => handleMenuItemClick('/usage')}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
              >
                <Icon name="Activity" size={16} color="var(--color-muted-foreground)" />
                <span className="text-xs text-foreground">Activity</span>
              </button>
            </div>
          </div>

          {/* Profile Menu Items */}
          <div className="py-1">
            {profileMenuItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleMenuItemClick(item?.path)}
                className="flex items-start space-x-3 w-full px-4 py-3 text-left hover:bg-muted transition-colors"
              >
                <Icon name={item?.icon} size={16} color="var(--color-muted-foreground)" className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item?.label}</p>
                  {item?.description && (
                    <p className="text-xs text-muted-foreground">{item?.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          <hr className="border-border" />

          {/* Support Items */}
          <div className="py-1">
            <div className="px-4 py-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Support
              </p>
            </div>
            {supportItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleMenuItemClick(item?.path)}
                className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-muted transition-colors"
              >
                <Icon name={item?.icon} size={16} color="var(--color-muted-foreground)" />
                <span className="text-sm text-foreground">{item?.label}</span>
              </button>
            ))}
          </div>

          <hr className="border-border" />

          {/* Logout */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-2 py-2 text-left rounded-md hover:bg-error/10 transition-colors group"
            >
              <Icon 
                name="LogOut" 
                size={16} 
                color="var(--color-error)"
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-sm text-error font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;