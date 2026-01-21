import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import { 
  Settings as SettingsIcon, User, Lock, Bell, Moon, Wallet,
  Save, AlertCircle, CheckCircle2
} from 'lucide-react';

const Settings = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    walletAddress: user?.walletAddress || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [settings, setSettings] = useState({
    emailNotifications: user?.settings?.emailNotifications ?? true,
    darkMode: user?.settings?.darkMode ?? true
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await usersAPI.updateProfile(profileData);
      await refreshUser();
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await usersAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Password changed successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    try {
      await usersAPI.updateSettings({ [key]: value });
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="page animate-fadeIn">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>Settings</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your account preferences</p>
        </div>

        {message.text && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: 'var(--spacing-md)',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)',
            color: message.type === 'success' ? 'var(--success)' : 'var(--error)' }}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span style={{ fontSize: '0.875rem' }}>{message.text}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
          {/* Sidebar */}
          <div style={{ width: '200px', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)',
                      padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--radius-md)',
                      background: activeTab === tab.id ? 'rgba(198, 255, 0, 0.1)' : 'transparent',
                      border: 'none', cursor: 'pointer',
                      color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                      transition: 'all var(--transition-fast)', textAlign: 'left', width: '100%' }}>
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            {activeTab === 'profile' && (
              <div className="card">
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Profile Information</h3>
                <form onSubmit={handleProfileUpdate}>
                  <div className="input-group">
                    <label className="input-label">Email</label>
                    <input type="email" className="input" value={user?.email || ''} disabled
                      style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Username</label>
                    <input type="text" className="input" placeholder="Enter username"
                      value={profileData.username} onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))} />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Wallet Address</label>
                    <div style={{ position: 'relative' }}>
                      <Wallet size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                      <input type="text" className="input" placeholder="0x..." style={{ paddingLeft: '40px' }}
                        value={profileData.walletAddress} onChange={(e) => setProfileData(prev => ({ ...prev, walletAddress: e.target.value }))} />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="card">
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Change Password</h3>
                <form onSubmit={handlePasswordChange}>
                  <div className="input-group">
                    <label className="input-label">Current Password</label>
                    <input type="password" className="input" placeholder="••••••••"
                      value={passwordData.currentPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} />
                  </div>

                  <div className="input-group">
                    <label className="input-label">New Password</label>
                    <input type="password" className="input" placeholder="••••••••"
                      value={passwordData.newPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Confirm New Password</label>
                    <input type="password" className="input" placeholder="••••••••"
                      value={passwordData.confirmPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    <Lock size={18} /> {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card">
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Notification Preferences</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 'var(--spacing-md)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)' }}>
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>Email Notifications</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Receive updates about your proofs</div>
                  </div>
                  <button onClick={() => handleSettingsUpdate('emailNotifications', !settings.emailNotifications)}
                    style={{ width: '48px', height: '24px', borderRadius: 'var(--radius-full)',
                      background: settings.emailNotifications ? 'var(--primary)' : 'var(--bg-card)',
                      border: `2px solid ${settings.emailNotifications ? 'var(--primary)' : 'var(--border-primary)'}`,
                      cursor: 'pointer', position: 'relative', transition: 'all var(--transition-fast)' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%',
                      background: settings.emailNotifications ? 'var(--bg-primary)' : 'var(--text-tertiary)',
                      position: 'absolute', top: '2px', left: settings.emailNotifications ? '26px' : '2px',
                      transition: 'all var(--transition-fast)' }} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 'var(--spacing-md)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>Dark Mode</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Use dark theme</div>
                  </div>
                  <button onClick={() => handleSettingsUpdate('darkMode', !settings.darkMode)}
                    style={{ width: '48px', height: '24px', borderRadius: 'var(--radius-full)',
                      background: settings.darkMode ? 'var(--primary)' : 'var(--bg-card)',
                      border: `2px solid ${settings.darkMode ? 'var(--primary)' : 'var(--border-primary)'}`,
                      cursor: 'pointer', position: 'relative', transition: 'all var(--transition-fast)' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%',
                      background: settings.darkMode ? 'var(--bg-primary)' : 'var(--text-tertiary)',
                      position: 'absolute', top: '2px', left: settings.darkMode ? '26px' : '2px',
                      transition: 'all var(--transition-fast)' }} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
