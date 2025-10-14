"use client";
import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Icon from "../AppIcon";
import Button from "./Button";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, formData, signOut, loading } = useAuth();
  const tempUserPlan = true;

  const navigationItems = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard-overview", icon: "LayoutDashboard" },
      { label: "Image Tools", path: "/image-tools", icon: "Image" },
      { label: "PDF Tools", path: "/pdf-management-hub", icon: "FileText" },
      { label: "File Converter", path: "/file-converter", icon: "RefreshCw" },
    ],
    []
  );

  const profileMenuItems = useMemo(
    () => [
      { label: "Profile Settings", path: "/user-profile-management", icon: "User" },
      { label: "Subscription", path: "/user-profile-management/subscription", icon: "CreditCard" },
      { label: "Usage Analytics", path: "/user-profile-management/user-analytics", icon: "BarChart3" },
      { label: "Security Settings", path: "/user-profile-management/security", icon: "Shield" },
    ],
    []
  );

  const handleLogout = useCallback(() => {
    signOut();
    setIsProfileDropdownOpen(false);
  }, [signOut]);

  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);
  const toggleProfileDropdown = useCallback(() => setIsProfileDropdownOpen(prev => !prev), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-resting">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link href="/dashboard-overview" className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Wrench" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground hidden md:block">
            ToolSuite Pro
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              href={item?.path}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted"
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
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>

          {/* Profile Dropdown */}
          <div className="relative pr-8">
            {loading ? (
              <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
            ) : user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleProfileDropdown}
                aria-label="User menu"
                className="w-11 h-11 flex gap-0.5 items-start p-0"
              >
                <Image
                  src={formData?.profileImage}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover rounded-full"
                  priority
                />
                {tempUserPlan && (
                  <span className="bg-[#ECFF79] border select-none text-black text-[9px] px-2 py-0.5 rounded-full shadow-sm">
                    PRO
                  </span>
                )}
              </Button>
            ) : (
              <Link
                href="/auth/signin"
                className="rounded-full"
                aria-label="Sign in"
              >
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors">
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
                className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors hover:bg-muted"
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
