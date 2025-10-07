"use client"
import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';

const AccountDetailsTab = ({ user: initialUser }) => {
  const { refreshUser, fetchUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: ''
  });


  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    smsAlerts: false,
    marketingEmails: true,
    securityAlerts: true,
    usageReports: true
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  useEffect(() => {
    if (initialUser) {
      setFormData({
        name: initialUser.name || '',
        email: initialUser.email || '',
        profileImage: initialUser.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      });
    }
  }, [initialUser]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleNotificationChange = (field, checked) => {
    setNotifications(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formDataToUpload = new FormData();
      formDataToUpload.append('file', file);

      const response = await api.post('/upload', formDataToUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          profileImage: response.data.url
        }));
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/user/profile', {
        name: formData.name,
        email: formData.email,
        profileImage: formData.profileImage,
      });

      if (response.data.success) {
        const updatedUser = response.data.data;

        setFormData({
          name: updatedUser.name,
          email: updatedUser.email,
          profileImage: updatedUser.profileImage,
        });

        setSuccess('Profile updated successfully!');
        setIsEditing(false);

        if (refreshUser) await refreshUser();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };


  const handleCancel = () => {
    if (initialUser) {
      setFormData({
        name: initialUser.name || '',
        email: initialUser.email || '',
        profileImage: initialUser.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="space-y-8">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
          <Icon name="CheckCircle" size={20} color="green" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <Icon name="AlertCircle" size={20} color="red" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
        <h3 className="text-lg font-semibold text-foreground mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border">
              {isUploading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Icon name="Loader" size={24} className="animate-spin" />
                </div>
              ) : (
                <Image
                  src={formData.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />

              )}
            </div>
            {isEditing && !isUploading && (
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
            <h4 className="text-base font-medium text-foreground">{formData.name}</h4>
            <p className="text-sm text-muted-foreground mb-3">{formData.email}</p>
            {isEditing && (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.querySelector('input[type="file"]')?.click()}
                  disabled={isUploading}
                >
                  <Icon name="Upload" size={16} className="mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload New Photo'}
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
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            disabled={!isEditing}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            disabled={!isEditing}
            description="This email is used for login and notifications"
            required
          />
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