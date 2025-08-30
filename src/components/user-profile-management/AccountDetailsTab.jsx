"use client"
import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';

const AccountDetailsTab = () => {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc.',
    jobTitle: 'Senior Developer',
    timezone: 'America/New_York',
    language: 'English'
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    smsAlerts: false,
    marketingEmails: true,
    securityAlerts: true,
    usageReports: true
  });

  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' }
  ];

  const languages = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Español' },
    { value: 'French', label: 'Français' },
    { value: 'German', label: 'Deutsch' },
    { value: 'Italian', label: 'Italiano' },
    { value: 'Portuguese', label: 'Português' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field, checked) => {
    setNotifications(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleImageUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e?.target?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Solutions Inc.',
      jobTitle: 'Senior Developer',
      timezone: 'America/New_York',
      language: 'English'
    });
  };

  return (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
        <h3 className="text-lg font-semibold text-foreground mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border">
              <Image
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                <Icon name="Camera" size={16} color="white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-base font-medium text-foreground">{formData?.firstName} {formData?.lastName}</h4>
            <p className="text-sm text-muted-foreground mb-3">{formData?.email}</p>
            {isEditing && (
              <div className="space-y-2">
                <Button variant="outline" size="sm" onClick={() => document.querySelector('input[type="file"]')?.click()}>
                  <Icon name="Upload" size={16} className="mr-2" />
                  Upload New Photo
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or GIF. Max size 5MB. Recommended 400x400px.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Personal Information */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Icon name="Edit" size={16} className="mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} loading={isSaving}>
                <Icon name="Save" size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            type="text"
            value={formData?.firstName}
            onChange={(e) => handleInputChange('firstName', e?.target?.value)}
            disabled={!isEditing}
            required
          />
          <Input
            label="Last Name"
            type="text"
            value={formData?.lastName}
            onChange={(e) => handleInputChange('lastName', e?.target?.value)}
            disabled={!isEditing}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            disabled={!isEditing}
            description="This email is used for login and notifications"
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            disabled={!isEditing}
          />
          <Input
            label="Company"
            type="text"
            value={formData?.company}
            onChange={(e) => handleInputChange('company', e?.target?.value)}
            disabled={!isEditing}
          />
          <Input
            label="Job Title"
            type="text"
            value={formData?.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e?.target?.value)}
            disabled={!isEditing}
          />
        </div>
      </div>
      {/* Preferences */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
        <h3 className="text-lg font-semibold text-foreground mb-6">Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
            <select
              value={formData?.timezone}
              onChange={(e) => handleInputChange('timezone', e?.target?.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {timezones?.map(tz => (
                <option key={tz?.value} value={tz?.value}>{tz?.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Language</label>
            <select
              value={formData?.language}
              onChange={(e) => handleInputChange('language', e?.target?.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {languages?.map(lang => (
                <option key={lang?.value} value={lang?.value}>{lang?.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Notification Preferences */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
        <h3 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          <Checkbox
            label="Email Updates"
            description="Receive updates about new features and improvements"
            checked={notifications?.emailUpdates}
            onChange={(e) => handleNotificationChange('emailUpdates', e?.target?.checked)}
            disabled={!isEditing}
          />
          <Checkbox
            label="SMS Alerts"
            description="Get text messages for important account activities"
            checked={notifications?.smsAlerts}
            onChange={(e) => handleNotificationChange('smsAlerts', e?.target?.checked)}
            disabled={!isEditing}
          />
          <Checkbox
            label="Marketing Emails"
            description="Receive promotional content and special offers"
            checked={notifications?.marketingEmails}
            onChange={(e) => handleNotificationChange('marketingEmails', e?.target?.checked)}
            disabled={!isEditing}
          />
          <Checkbox
            label="Security Alerts"
            description="Important security notifications (recommended)"
            checked={notifications?.securityAlerts}
            onChange={(e) => handleNotificationChange('securityAlerts', e?.target?.checked)}
            disabled={!isEditing}
          />
          <Checkbox
            label="Usage Reports"
            description="Monthly reports about your tool usage and statistics"
            checked={notifications?.usageReports}
            onChange={(e) => handleNotificationChange('usageReports', e?.target?.checked)}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsTab;