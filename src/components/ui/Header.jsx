'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard-overview',
      icon: 'LayoutDashboard'
    },
    {
      label: 'Image Tools',
      path: '/image-tools',
      icon: 'Image'
    },
    {
      label: 'PDF Tools',
      path: '/pdf-management-hub',
      icon: 'FileText'
    },
    {
      label: 'File Converter',
      path: '/file-converter',
      icon: 'RefreshCw'
    }
  ];

  const profileMenuItems = [
    {
      label: 'Profile Settings',
      path: '/user-profile-management',
      icon: 'User'
    },
    {
      label: 'Subscription',
      path: '/subscription',
      icon: 'CreditCard'
    },
    {
      label: 'Usage Analytics',
      path: '/usage',
      icon: 'BarChart3'
    },
    {
      label: 'Help & Support',
      path: '/help',
      icon: 'HelpCircle'
    }
  ];
  console.log(user);



  const handleLogout = () => {
    signOut()
    console.log('Logging out...');
    setIsProfileDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-resting">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link href="/dashboard-overview" className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Wrench" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground hidden sm:block">
            ToolSuite Pro
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              href={item?.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
          </Button>

          {/* Profile Dropdown */}
          <div className="relative">
            {loading ? (
              <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
            ) : user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleProfileDropdown}
                className="rounded-full"
                aria-label="User menu"
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
              </Button>
            ) : (
              <Link
                href="/auth/signin"
                className="rounded-full"
                aria-label="Sign in"
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
              </Link>
            )}

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && user && (
              <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-floating z-60">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-black">{user?.name}</p>
                  <p className="text-xs text-gray-600">{user?.email}</p>
                </div>
                <div className="py-1">
                  {profileMenuItems?.map((item) => (
                    <Link
                      key={item?.path}
                      href={item?.path}
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </Link>
                  ))}
                  <hr className="my-1 border-border" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-error hover:bg-muted transition-colors"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border shadow-elevated">
          <nav className="px-4 py-3 space-y-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                href={item?.path}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors`}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
      {/* Overlay for profile dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;