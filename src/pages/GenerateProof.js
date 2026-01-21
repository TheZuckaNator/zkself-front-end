import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { proofsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Zap, ArrowLeft, User, Globe, Fingerprint, Shield,
  CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';

const GenerateProof = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [proofTypes, setProofTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxUsage: 1,
    validDays: 365
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const proofTypeIcons = {
    'age_over_18': User, 'age_over_21': User, 'not_sanctioned': Globe,
    'is_human': Fingerprint, 'unique_person': Shield, 'country_allowed': Globe
  };

  useEffect(() => {
    const fetchProofTypes = async () => {
      try {
        const response = await proofsAPI.getTypes();
        setProofTypes(response.data.data.proofTypes);
      } catch (err) {
        console.error('Failed to fetch proof types:', err);
      }
    };
    fetchProofTypes();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedType) {
      setError('Please select a proof type');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const response = await proofsAPI.generate({
        proofType: selectedType,
        name: formData.name || `${selectedType} Proof`,
        description: formData.description,
        maxUsage: parseInt(formData.maxUsage) || 1,
        validDays: parseInt(formData.validDays) || 365
      });

      navigate(`/proofs/${response.data.data.proof.id}`);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to generate proof');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="page animate-fadeIn">
      <div className="container" style={{ maxWidth: '800px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <ArrowLeft size={18} /> Back
        </button>

        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>Generate ZK Proof</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Create a zero-knowledge proof to verify your attributes without revealing personal data
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: 'var(--spacing-md)',
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)', color: 'var(--error)' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.875rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleGenerate}>
          {/* Proof Type Selection */}
          <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Select Proof Type</h3>
            <div className="grid grid-2" style={{ gap: 'var(--spacing-md)' }}>
              {proofTypes.map(type => {
                const Icon = proofTypeIcons[type.type] || Shield;
                const isSelected = selectedType === type.type;
                
                return (
                  <button
                    key={type.type}
                    type="button"
                    onClick={() => type.available && setSelectedType(type.type)}
                    disabled={!type.available}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)',
                      padding: 'var(--spacing-md)', background: isSelected ? 'rgba(198, 255, 0, 0.1)' : 'var(--bg-tertiary)',
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'transparent'}`,
                      borderRadius: 'var(--radius-md)', cursor: type.available ? 'pointer' : 'not-allowed',
                      opacity: type.available ? 1 : 0.5, textAlign: 'left', transition: 'all var(--transition-fast)'
                    }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--gradient-primary)' : 'var(--bg-card)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} style={{ color: isSelected ? 'var(--bg-primary)' : 'var(--primary)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', marginBottom: '4px', color: 'var(--text-primary)' }}>{type.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{type.description}</div>
                      {!type.available && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '4px' }}>
                          Requires additional verification
                        </div>
                      )}
                    </div>
                    {isSelected && <CheckCircle2 size={20} style={{ color: 'var(--primary)' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Proof Details */}
          <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Proof Details</h3>
            
            <div className="input-group">
              <label className="input-label">Proof Name</label>
              <input type="text" className="input" placeholder="My Age Verification"
                value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
            </div>

            <div className="input-group">
              <label className="input-label">Description (optional)</label>
              <textarea className="input" rows={3} placeholder="What is this proof for?"
                value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                style={{ resize: 'vertical' }} />
            </div>

            <div className="grid grid-2">
              <div className="input-group">
                <label className="input-label">Max Usage</label>
                <input type="number" className="input" min="1" max="1000"
                  value={formData.maxUsage} onChange={(e) => setFormData(prev => ({ ...prev, maxUsage: e.target.value }))} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>0 = unlimited</span>
              </div>

              <div className="input-group">
                <label className="input-label">Valid For (days)</label>
                <input type="number" className="input" min="1" max="365"
                  value={formData.validDays} onChange={(e) => setFormData(prev => ({ ...prev, validDays: e.target.value }))} />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}
            disabled={generating || !selectedType}>
            {generating ? (
              <><Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Generating Proof...</>
            ) : (
              <><Zap size={20} /> Generate ZK Proof</>
            )}
          </button>
        </form>

        {/* Info Box */}
        <div style={{ marginTop: 'var(--spacing-xl)', padding: 'var(--spacing-lg)',
          background: 'rgba(198, 255, 0, 0.05)', border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-lg)' }}>
          <h4 style={{ color: 'var(--primary)', marginBottom: 'var(--spacing-sm)' }}>How ZK Proofs Work</h4>
          <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <li>Your personal data never leaves your device</li>
            <li>Verifiers only see a cryptographic proof, not your actual information</li>
            <li>Each proof has a unique nullifier to prevent double-use</li>
            <li>Proofs can be verified on-chain without revealing your identity</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GenerateProof;
