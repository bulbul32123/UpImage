"use client"
import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';


const Security = () => {
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const activeSessions = [
        {
            id: 1,
            device: 'MacBook Pro',
            browser: 'Chrome 118.0',
            location: 'New York, NY',
            ipAddress: '192.168.1.100',
            lastActive: '2024-08-30T09:30:00Z',
            current: true
        },
        {
            id: 2,
            device: 'iPhone 15',
            browser: 'Safari Mobile',
            location: 'New York, NY',
            ipAddress: '192.168.1.101',
            lastActive: '2024-08-29T15:45:00Z',
            current: false
        },
        {
            id: 3,
            device: 'Windows PC',
            browser: 'Edge 118.0',
            location: 'Boston, MA',
            ipAddress: '10.0.0.50',
            lastActive: '2024-08-28T11:20:00Z',
            current: false
        }
    ];

    const securityEvents = [
        {
            id: 1,
            type: 'login',
            description: 'Successful login from Chrome on MacBook Pro',
            timestamp: '2024-08-30T09:30:00Z',
            location: 'New York, NY',
            status: 'success'
        },
        {
            id: 2,
            type: 'password_change',
            description: 'Password changed successfully',
            timestamp: '2024-08-25T14:15:00Z',
            location: 'New York, NY',
            status: 'success'
        },
        {
            id: 3,
            type: 'failed_login',
            description: 'Failed login attempt',
            timestamp: '2024-08-20T08:45:00Z',
            location: 'Unknown Location',
            status: 'warning'
        }
    ];

    const handlePasswordChange = (field, value) => {
        setPasswordForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e?.preventDefault();
        if (passwordForm?.newPassword !== passwordForm?.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setIsChangingPassword(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsChangingPassword(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Password changed successfully');
    };

    const handleEnable2FA = () => {
        setShowQRCode(true);
    };

    const handleVerify2FA = () => {
        if (verificationCode?.length === 6) {
            setTwoFactorEnabled(true);
            setShowQRCode(false);
            setVerificationCode('');
            alert('Two-factor authentication enabled successfully');
        }
    };

    const handleDisable2FA = () => {
        setTwoFactorEnabled(false);
        alert('Two-factor authentication disabled');
    };

    const handleTerminateSession = (sessionId) => {
        console.log('Terminating session:', sessionId);
        alert('Session terminated successfully');
    };

    const handleDeleteAccount = () => {
        if (deleteConfirmation === 'DELETE') {
            console.log('Account deletion requested');
            alert('Account deletion request submitted. You will receive a confirmation email.');
            setShowDeleteModal(false);
            setDeleteConfirmation('');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString)?.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDeviceIcon = (device) => {
        if (device?.includes('iPhone') || device?.includes('iPad')) return 'Smartphone';
        if (device?.includes('MacBook') || device?.includes('Mac')) return 'Laptop';
        if (device?.includes('Windows')) return 'Monitor';
        return 'Globe';
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'login': return 'LogIn';
            case 'password_change': return 'Key';
            case 'failed_login': return 'AlertTriangle';
            default: return 'Activity';
        }
    };

    const getEventColor = (status) => {
        switch (status) {
            case 'success': return 'var(--color-success)';
            case 'warning': return 'var(--color-warning)';
            case 'error': return 'var(--color-error)';
            default: return 'var(--color-muted-foreground)';
        }
    };

    return (
        <div className="col-span-2 lg:col-span-3">
            <div className="pb-6">
                <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon
                                name={"Shield"}
                                size={20}
                                color="var(--color-primary)"
                            />
                        </div>
                        <div>
                            <h1 className="text-fluid-2xl font-semibold text-foreground">
                                Security Settings
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Secure your account with advanced security settings
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Password Change */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                <h3 className="text-lg font-semibold text-foreground mb-6">Change Password</h3>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Input
                                label="Current Password"
                                type="password"
                                value={passwordForm?.currentPassword}
                                onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
                                required
                                placeholder="Enter your current password"
                            />
                        </div>
                        <Input
                            label="New Password"
                            type="password"
                            value={passwordForm?.newPassword}
                            onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
                            required
                            placeholder="Enter new password"
                            description="Must be at least 8 characters long"
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={passwordForm?.confirmPassword}
                            onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
                            required
                            placeholder="Confirm new password"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" loading={isChangingPassword}>
                            <Icon name="Key" size={16} className="mr-2" />
                            Update Password
                        </Button>
                    </div>
                </form>
            </div>
            {/* Two-Factor Authentication */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${twoFactorEnabled
                            ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                            }`}>
                            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                </div>

                {!twoFactorEnabled ? (
                    <div>
                        <div className="flex items-start space-x-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon name="Shield" size={20} color="var(--color-primary)" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-foreground mb-1">Secure Your Account</h4>
                                <p className="text-xs text-muted-foreground">
                                    Two-factor authentication adds an extra layer of security by requiring a code from your phone in addition to your password.
                                </p>
                            </div>
                        </div>

                        {!showQRCode ? (
                            <Button onClick={handleEnable2FA}>
                                <Icon name="Shield" size={16} className="mr-2" />
                                Enable Two-Factor Authentication
                            </Button>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-muted/50 rounded-lg p-4 text-center">
                                    <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center border">
                                        <Icon name="QrCode" size={64} color="var(--color-muted-foreground)" />
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Scan this QR code with your authenticator app
                                    </p>
                                    <p className="text-xs text-muted-foreground font-mono">
                                        Manual entry: JBSWY3DPEHPK3PXP
                                    </p>
                                </div>

                                <div className="flex space-x-3">
                                    <Input
                                        label="Verification Code"
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e?.target?.value)}
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                        className="flex-1"
                                    />
                                    <div className="flex items-end">
                                        <Button
                                            onClick={handleVerify2FA}
                                            disabled={verificationCode?.length !== 6}
                                        >
                                            Verify
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="flex items-start space-x-3 mb-6">
                            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon name="ShieldCheck" size={20} color="var(--color-success)" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-foreground mb-1">Two-Factor Authentication Active</h4>
                                <p className="text-xs text-muted-foreground">
                                    Your account is protected with two-factor authentication. You&apos;ll need your authenticator app to sign in.
                                </p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <Button variant="outline" onClick={handleDisable2FA}>
                                <Icon name="ShieldOff" size={16} className="mr-2" />
                                Disable 2FA
                            </Button>
                            <Button variant="outline">
                                <Icon name="Download" size={16} className="mr-2" />
                                Download Backup Codes
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            {/* Active Sessions */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Active Sessions</h3>
                    <Button variant="outline" size="sm">
                        <Icon name="RefreshCw" size={16} className="mr-2" />
                        Refresh
                    </Button>
                </div>

                <div className="space-y-4">
                    {activeSessions?.map((session) => (
                        <div key={session?.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                    <Icon name={getDeviceIcon(session?.device)} size={20} color="var(--color-muted-foreground)" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h4 className="text-sm font-medium text-foreground">{session?.device}</h4>
                                        {session?.current && (
                                            <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{session?.browser}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {session?.location} • {session?.ipAddress}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Last active: {formatDate(session?.lastActive)}
                                    </p>
                                </div>
                            </div>

                            {!session?.current && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleTerminateSession(session?.id)}
                                >
                                    <Icon name="X" size={14} className="mr-1" />
                                    Terminate
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {/* Security Events */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Recent Security Events</h3>
                    <Button variant="outline" size="sm">
                        <Icon name="Download" size={16} className="mr-2" />
                        Export Log
                    </Button>
                </div>

                <div className="space-y-3">
                    {securityEvents?.map((event) => (
                        <div key={event?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <Icon name={getEventIcon(event?.type)} size={14} color={getEventColor(event?.status)} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground">{event?.description}</p>
                                <div className="flex items-center space-x-4 mt-1">
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(event?.timestamp)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {event?.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Account Deletion */}
            <div className="bg-card rounded-lg p-6 border border-error/20 shadow-resting">
                <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-error mb-2">Delete Account</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <Icon name="Trash2" size={16} className="mr-2" />
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>
            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-lg p-6 max-w-md w-full border border-border shadow-floating">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                                <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Delete Account</h3>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-muted-foreground mb-4">
                                This will permanently delete your account and all associated data including:
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                                <li>• All processed files and history</li>
                                <li>• Usage analytics and reports</li>
                                <li>• Account settings and preferences</li>
                                <li>• Subscription and billing information</li>
                            </ul>
                            <p className="text-sm text-error font-medium">
                                This action cannot be undone.
                            </p>
                        </div>

                        <div className="mb-6">
                            <Input
                                label={`Type "DELETE" to confirm`}
                                type="text"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e?.target?.value)}
                                placeholder="DELETE"
                            />
                        </div>

                        <div className="flex space-x-3">
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmation('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                fullWidth
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmation !== 'DELETE'}
                            >
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Security;