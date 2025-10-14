"use client";
import React, { useCallback } from "react";
import Icon from "@/components/AppIcon";
import Image from "@/components/AppImage";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { useAuth } from "@/context/AuthContext";
import { useProfileUpdate } from "@/hooks/useProfileUpdate";

const Account = () => {
  const { user, loading, formData } = useAuth();
  const {
    localFormData,
    uiState,
    fileInputRef,
    handleInputChange,
    handleImageUpload,
    handleSave,
    handleCancel,
    handleEditClick,
    isFormChanged,
  } = useProfileUpdate({
    name: formData.name,
    email: formData.email,
    profileImage: formData.profileImage,
    originalProfileImage: formData.profileImage,
  });

  const [notifications, setNotifications] = React.useState({
    emailUpdates: true,
    smsAlerts: false,
    marketingEmails: true,
    securityAlerts: true,
    usageReports: true,
  });

  const handleNotificationChange = useCallback((field, checked) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: checked,
    }));
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  if (loading) {
    return <AccountSkeleton />;
  }

  return (
    <div className="col-span-2 lg:col-span-3">
      {/* Header */}
      <div className="pb-6">
        <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="User" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h1 className="text-fluid-2xl font-semibold text-foreground">
                Account Details
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your personal information and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {uiState.success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3 animate-in fade-in">
          <Icon name="CheckCircle" size={20} color="green" />
          <p className="text-sm text-green-800">{uiState.success}</p>
        </div>
      )}

      {uiState.error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 animate-in fade-in">
          <Icon name="AlertCircle" size={20} color="red" />
          <p className="text-sm text-red-800">{uiState.error}</p>
        </div>
      )}

      {/* Profile Picture Section */}
      <ProfilePictureSection
        localFormData={localFormData}
        uiState={uiState}
        fileInputRef={fileInputRef}
        handleImageUpload={handleImageUpload}
        triggerFileInput={triggerFileInput}
        loading={loading}
      />

      {/* Personal Information */}
      <PersonalInfoSection
        localFormData={localFormData}
        uiState={uiState}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        handleEditClick={handleEditClick}
        isFormChanged={isFormChanged}
        loading={loading}
      />

      {/* Notification Preferences */}
      <NotificationsSection
        notifications={notifications}
        handleNotificationChange={handleNotificationChange}
        isEditing={uiState.isEditing}
      />
    </div>
  );
};

const ProfilePictureSection = React.memo(
  ({
    localFormData,
    uiState,
    fileInputRef,
    handleImageUpload,
    triggerFileInput,
    loading,
  }) => (
    <div className="bg-card rounded-lg p-6 border border-border shadow-resting mb-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Profile Picture</h3>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border">
            {loading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                <Icon name="Loader" size={22} className="animate-spin text-muted-foreground" />
              </div>
            ) : localFormData.profileImage ? (
              <Image
                src={localFormData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Icon name="User" size={22} color="var(--color-muted-foreground)" />
              </div>
            )}
          </div>

          {uiState.isEditing && !loading && (
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-md">
              <Icon name="Camera" size={16} color="white" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uiState.isUploadingImage}
              />
            </label>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <h4 className="text-base font-medium text-foreground">
            {localFormData.name}
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            {localFormData.email}
          </p>

          {uiState.isEditing && (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={triggerFileInput}
                disabled={loading || uiState.isUploadingImage}
              >
                <Icon name="Upload" size={16} className="mr-2" />
                {uiState.isUploadingImage ? "Uploading..." : "Upload New Photo"}
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, GIF or WebP. Max 5MB. Recommended 400x400px.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
);

ProfilePictureSection.displayName = "ProfilePictureSection";

const PersonalInfoSection = React.memo(
  ({
    localFormData,
    uiState,
    handleInputChange,
    handleSave,
    handleCancel,
    handleEditClick,
    isFormChanged,
    loading,
  }) => (
    <div className="bg-card rounded-lg p-6 border border-border shadow-resting mb-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
        {!uiState.isEditing ? (
          <Button
            variant="outline"
            disabled={loading}
            onClick={handleEditClick}
          >
            <Icon name="Edit" size={16} className="mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={uiState.isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormChanged || uiState.isSaving}
            >
              <Icon name="Save" size={16} className="mr-2" />
              {uiState.isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          type="text"
          value={localFormData.name}
          onChange={(e) => handleInputChange("name", e?.target?.value)}
          disabled={!uiState.isEditing || loading}
          loading={loading}
          required
        />

        <Input
          label="Email Address"
          type="email"
          value={localFormData.email}
          onChange={(e) => handleInputChange("email", e?.target?.value)}
          disabled={!uiState.isEditing || loading}
          loading={loading}
          description="Used for login and notifications"
          required
        />
      </div>
    </div>
  )
);

PersonalInfoSection.displayName = "PersonalInfoSection";

const NotificationsSection = React.memo(
  ({ notifications, handleNotificationChange, isEditing }) => (
    <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
      <h3 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h3>
      <div className="space-y-4">
        {[
          {
            key: "emailUpdates",
            label: "Email Updates",
            desc: "Receive updates about new features",
          },
          {
            key: "smsAlerts",
            label: "SMS Alerts",
            desc: "Get texts for important activities",
          },
          {
            key: "marketingEmails",
            label: "Marketing Emails",
            desc: "Receive promotional content",
          },
          {
            key: "securityAlerts",
            label: "Security Alerts",
            desc: "Important security notifications (recommended)",
          },
          {
            key: "usageReports",
            label: "Usage Reports",
            desc: "Monthly usage and statistics",
          },
        ].map(({ key, label, desc }) => (
          <Checkbox
            key={key}
            label={label}
            description={desc}
            checked={notifications[key]}
            onChange={(e) => handleNotificationChange(key, e?.target?.checked)}
            disabled={!isEditing}
          />
        ))}
      </div>
    </div>
  )
);

NotificationsSection.displayName = "NotificationsSection";

// ============================================================================
// SKELETON LOADER
// ============================================================================
const AccountSkeleton = () => (
  <div className="col-span-2 lg:col-span-3">
    <div className="pb-6">
      <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex-1">
            <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse mb-2" />
            <div className="h-4 w-56 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      </div>
    </div>

    <div className="bg-card rounded-lg p-6 border border-border shadow-resting mb-4">
      <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse mb-4" />
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-4 w-56 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    </div>

    <div className="bg-card rounded-lg p-6 border border-border shadow-resting mb-4">
      <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
      </div>
    </div>
  </div>
);

export default Account;
