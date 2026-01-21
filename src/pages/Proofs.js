import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { proofsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  FileCheck, Plus, Search, ChevronLeft, ChevronRight,
  User, Globe, Fingerprint, Shield, Eye, Trash2
} from 'lucide-react';

const Proofs = () => {
  const { isKycVerified } = useAuth();
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ proofType: '', status: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const proofTypeIcons = {
    'age_over_18': User, 'age_over_21': User, 'not_sanctioned': Globe,
    'is_human': Fingerprint, 'unique_person': Shield, 'country_allowed': Globe
  };

  const proofTypeLabels = {
    'age_over_18': 'Age Over 18', 'age_over_21': 'Age Over 21',
    'not_sanctioned': 'Not Sanctioned', 'is_human': 'Human Verified',
    'unique_person': 'Unique Person', 'country_allowed': 'Country Allowed'
  };

  useEffect(() => { fetchProofs(); }, [pagination.page, filters]);

  const fetchProofs = async () => {
    setLoading(true);
    try {
      const response = await proofsAPI.list({ page: pagination.page, limit: 10, ...filters });
      setProofs(response.data.data.proofs);
      setPagination(prev => ({ ...prev, ...response.data.data.pagination }));
    } catch (err) {
      console.error('Failed to fetch proofs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (proofId) => {
    if (!window.confirm('Are you sure you want to revoke this proof?')) return;
    try {
      await proofsAPI.delete(proofId);
      fetchProofs();
    } catch (err) {
      console.error('Failed to delete proof:', err);
    }
  };

  const filteredProofs = proofs.filter(proof => 
    proof.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page animate-fadeIn">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)' }}>
          <div>
            <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>ZK Proofs</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your zero-knowledge proofs</p>
          </div>
          {isKycVerified && (
            <Link to="/proofs/generate" className="btn btn-primary">
              <Plus size={18} /> Generate Proof
            </Link>
          )}
        </div>

        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input type="text" className="input" placeholder="Search proofs..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingLeft: '36px' }} />
            </div>
            <select className="input" style={{ flex: '0 0 160px' }} value={filters.proofType}
              onChange={(e) => setFilters(prev => ({ ...prev, proofType: e.target.value }))}>
              <option value="">All Types</option>
              <option value="age_over_18">Age Over 18</option>
              <option value="age_over_21">Age Over 21</option>
              <option value="not_sanctioned">Not Sanctioned</option>
              <option value="is_human">Human Verified</option>
            </select>
            <select className="input" style={{ flex: '0 0 140px' }} value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}>
              <option value="">All Status</option>
              <option value="generated">Generated</option>
              <option value="verified">Verified</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>
        ) : filteredProofs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {filteredProofs.map(proof => {
              const Icon = proofTypeIcons[proof.proofType] || FileCheck;
              return (
                <div key={proof.id} className="card" style={{ padding: 'var(--spacing-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={24} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem' }}>{proof.name}</h4>
                        <span className={`badge badge-${proof.status === 'generated' || proof.status === 'verified' ? 'success' : proof.status === 'revoked' ? 'error' : 'warning'}`}>{proof.status}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--spacing-lg)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <span>{proofTypeLabels[proof.proofType]}</span>
                        <span>Used: {proof.usageCount}/{proof.maxUsage || '∞'}</span>
                        <span>Expires: {new Date(proof.validUntil).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <Link to={`/proofs/${proof.id}`} className="btn btn-ghost btn-sm"><Eye size={16} /></Link>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(proof.id)} style={{ color: 'var(--error)' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
            <FileCheck size={48} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>No proofs yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
              {isKycVerified ? 'Generate your first ZK proof to get started' : 'Complete KYC verification to generate proofs'}
            </p>
            {isKycVerified ? (
              <Link to="/proofs/generate" className="btn btn-primary"><Plus size={18} /> Generate First Proof</Link>
            ) : (
              <Link to="/kyc" className="btn btn-primary">Start KYC</Link>
            )}
          </div>
        )}

        {pagination.pages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
            <button className="btn btn-secondary btn-sm" disabled={pagination.page === 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}><ChevronLeft size={16} /></button>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Page {pagination.page} of {pagination.pages}</span>
            <button className="btn btn-secondary btn-sm" disabled={pagination.page === pagination.pages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}><ChevronRight size={16} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Proofs;
