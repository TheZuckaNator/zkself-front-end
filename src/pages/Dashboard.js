import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI, proofsAPI } from '../services/api';
import { 
  Shield, 
  FileCheck, 
  Fingerprint, 
  ArrowRight, 
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Lock,
  Globe,
  User
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentProofs, setRecentProofs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, proofsRes] = await Promise.all([
          usersAPI.getStats(),
          proofsAPI.list({ limit: 5 })
        ]);
        setStats(statsRes.data.data.stats);
        setRecentProofs(proofsRes.data.data.proofs);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getKycStatusBadge = () => {
    switch (user?.kycStatus) {
      case 'verified':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> Verified</span>;
      case 'pending':
        return <span className="badge badge-warning"><Clock size={12} /> Pending</span>;
      case 'rejected':
        return <span className="badge badge-error"><AlertTriangle size={12} /> Rejected</span>;
      default:
        return <span className="badge badge-info"><Shield size={12} /> Not Verified</span>;
    }
  };

  const proofTypeIcons = {
    'age_over_18': User,
    'age_over_21': User,
    'not_sanctioned': Globe,
    'is_human': Fingerprint,
    'unique_person': Shield,
    'country_allowed': Globe
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div className="spinner" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-fadeIn">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>
            Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.username || 'anon'}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Your privacy-first identity dashboard
          </p>
        </div>

        {/* KYC Status Card */}
        <div className="card" style={{ 
          marginBottom: 'var(--spacing-xl)',
          background: user?.kycStatus === 'verified' 
            ? 'linear-gradient(135deg, rgba(198, 255, 0, 0.05) 0%, transparent 100%)'
            : 'var(--bg-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-lg)',
                background: user?.kycStatus === 'verified' 
                  ? 'var(--gradient-primary)' 
                  : 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Fingerprint size={28} color={user?.kycStatus === 'verified' ? 'var(--bg-primary)' : 'var(--text-tertiary)'} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: '4px' }}>
                  <h3 style={{ margin: 0 }}>Identity Verification</h3>
                  {getKycStatusBadge()}
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {user?.kycStatus === 'verified' 
                    ? `Verified on ${new Date(user.kycVerifiedAt).toLocaleDateString()}`
                    : 'Complete KYC to generate ZK proofs'}
                </p>
              </div>
            </div>
            
            {user?.kycStatus !== 'verified' && (
              <Link to="/kyc" className="btn btn-primary">
                Start Verification
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div className="card stat-card">
            <div className="stat-value">{stats?.totalProofs || 0}</div>
            <div className="stat-label">Total Proofs</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">{stats?.activeProofs || 0}</div>
            <div className="stat-label">Active Proofs</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value" style={{ color: user?.kycStatus === 'verified' ? 'var(--success)' : 'var(--text-tertiary)' }}>
              {user?.kycStatus === 'verified' ? '✓' : '—'}
            </div>
            <div className="stat-label">KYC Status</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">
              {user?.privacyAttributes?.isAdult ? '✓' : '—'}
            </div>
            <div className="stat-label">Age Verified</div>
          </div>
        </div>

        {/* Quick Actions & Recent Proofs */}
        <div className="grid grid-2">
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <Link to="/proofs/generate" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Zap size={18} style={{ color: 'var(--primary)' }} />
                Generate New Proof
              </Link>
              <Link to="/proofs" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <FileCheck size={18} style={{ color: 'var(--primary)' }} />
                View All Proofs
              </Link>
              <Link to="/settings" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Lock size={18} style={{ color: 'var(--primary)' }} />
                Privacy Settings
              </Link>
            </div>
          </div>

          {/* Recent Proofs */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Proofs</h3>
              <Link to="/proofs" style={{ fontSize: '0.875rem' }}>View all</Link>
            </div>
            {recentProofs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {recentProofs.map(proof => {
                  const Icon = proofTypeIcons[proof.proofType] || FileCheck;
                  return (
                    <Link 
                      key={proof.id} 
                      to={`/proofs/${proof.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)',
                        padding: 'var(--spacing-sm)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <Icon size={18} style={{ color: 'var(--primary)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{proof.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          {new Date(proof.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`badge badge-${proof.status === 'generated' ? 'success' : 'warning'}`}>
                        {proof.status}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: 'var(--spacing-xl)',
                color: 'var(--text-tertiary)'
              }}>
                <FileCheck size={32} style={{ marginBottom: 'var(--spacing-sm)', opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: '0.875rem' }}>No proofs yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Attributes */}
        {user?.kycStatus === 'verified' && (
          <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
            <div className="card-header">
              <h3 className="card-title">Available Privacy Attributes</h3>
            </div>
            <div className="grid grid-4">
              {[
                { key: 'isAdult', label: 'Age 18+', icon: User },
                { key: 'isHuman', label: 'Human Verified', icon: Fingerprint },
                { key: 'isNotSanctioned', label: 'Not Sanctioned', icon: Globe },
                { key: 'countryCode', label: `Country: ${user.privacyAttributes?.countryCode || '—'}`, icon: Globe }
              ].map(attr => {
                const Icon = attr.icon;
                const verified = attr.key === 'countryCode' 
                  ? !!user.privacyAttributes?.countryCode
                  : user.privacyAttributes?.[attr.key];
                  
                return (
                  <div key={attr.key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-md)',
                    background: verified ? 'rgba(198, 255, 0, 0.05)' : 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${verified ? 'var(--border-accent)' : 'var(--border-primary)'}`
                  }}>
                    <Icon size={18} style={{ color: verified ? 'var(--primary)' : 'var(--text-tertiary)' }} />
                    <span style={{ 
                      fontSize: '0.875rem', 
                      color: verified ? 'var(--text-primary)' : 'var(--text-tertiary)' 
                    }}>
                      {attr.label}
                    </span>
                    {verified && <CheckCircle2 size={14} style={{ color: 'var(--primary)', marginLeft: 'auto' }} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
