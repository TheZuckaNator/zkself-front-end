import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { kycAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Fingerprint, Upload, Camera, CheckCircle2, AlertCircle, 
  FileText, ArrowRight, Loader2, Shield
} from 'lucide-react';

const KYC = () => {
  const { user, refreshUser, isKycVerified } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [documentData, setDocumentData] = useState({
    documentType: 'passport',
    documentCountry: 'NL',
    frontImage: null
  });

  useEffect(() => {
    if (isKycVerified) {
      setStep(4); // Show completed state
    }
  }, [isKycVerified]);

  const startSession = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await kycAPI.createSession({});
      setSession(response.data.data.session);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentData(prev => ({ ...prev, frontImage: file }));
    }
  };

  const uploadDocument = async () => {
    if (!documentData.frontImage) {
      setError('Please select a document image');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('documentType', documentData.documentType);
    formData.append('documentCountry', documentData.documentCountry);
    formData.append('frontImage', documentData.frontImage);

    try {
      await kycAPI.uploadDocument(session.id, formData);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const completeLiveness = async () => {
    setLoading(true);
    setError('');

    try {
      await kycAPI.completeLiveness(session.id, {});
      await kycAPI.completeSession(session.id);
      await refreshUser();
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to complete verification');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Start', icon: Shield },
    { num: 2, title: 'Document', icon: FileText },
    { num: 3, title: 'Liveness', icon: Camera },
    { num: 4, title: 'Complete', icon: CheckCircle2 }
  ];

  return (
    <div className="page animate-fadeIn">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--gradient-primary)',
            borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto var(--spacing-md)', boxShadow: 'var(--shadow-glow)' }}>
            <Fingerprint size={32} color="var(--bg-primary)" />
          </div>
          <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>Identity Verification</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Verify once, prove anything, reveal nothing
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isComplete = step > s.num;
            return (
              <React.Fragment key={s.num}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%',
                    background: isComplete ? 'var(--success)' : isActive ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${isActive ? 'var(--primary)' : 'transparent'}` }}>
                    <Icon size={18} color={isComplete || isActive ? 'var(--bg-primary)' : 'var(--text-tertiary)'} />
                  </div>
                  <span style={{ fontSize: '0.75rem', marginTop: 'var(--spacing-xs)',
                    color: isActive ? 'var(--primary)' : 'var(--text-tertiary)' }}>{s.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: '60px', height: '2px', background: step > s.num ? 'var(--success)' : 'var(--border-primary)',
                    alignSelf: 'center', marginBottom: '20px' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: 'var(--spacing-md)',
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)', color: 'var(--error)' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.875rem' }}>{error}</span>
          </div>
        )}

        {/* Step 1: Start */}
        {step === 1 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <Shield size={48} style={{ color: 'var(--primary)', marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Ready to Verify?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
              You'll need a valid government ID (passport, ID card, or driver's license)
            </p>
            <button onClick={startSession} className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <Loader2 size={20} className="animate-spin" /> : <><ArrowRight size={20} /> Begin Verification</>}
            </button>
          </div>
        )}

        {/* Step 2: Document */}
        {step === 2 && (
          <div className="card">
            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Upload Document</h3>
            
            <div className="input-group">
              <label className="input-label">Document Type</label>
              <select className="input" value={documentData.documentType}
                onChange={(e) => setDocumentData(prev => ({ ...prev, documentType: e.target.value }))}>
                <option value="passport">Passport</option>
                <option value="id_card">ID Card</option>
                <option value="drivers_license">Driver's License</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Issuing Country</label>
              <select className="input" value={documentData.documentCountry}
                onChange={(e) => setDocumentData(prev => ({ ...prev, documentCountry: e.target.value }))}>
                <option value="NL">Netherlands</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Document Image</label>
              <div style={{ border: '2px dashed var(--border-primary)', borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-xl)', textAlign: 'center', cursor: 'pointer',
                transition: 'all var(--transition-fast)', background: documentData.frontImage ? 'rgba(198, 255, 0, 0.05)' : 'transparent' }}
                onClick={() => document.getElementById('file-input').click()}>
                <input type="file" id="file-input" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                <Upload size={32} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-sm)' }} />
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  {documentData.frontImage ? documentData.frontImage.name : 'Click to upload or drag and drop'}
                </p>
              </div>
            </div>

            <button onClick={uploadDocument} className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading || !documentData.frontImage}>
              {loading ? <Loader2 size={20} className="animate-spin" /> : <><ArrowRight size={20} /> Continue</>}
            </button>
          </div>
        )}

        {/* Step 3: Liveness */}
        {step === 3 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <Camera size={48} style={{ color: 'var(--primary)', marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Liveness Check</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
              In demo mode, we'll simulate the liveness verification
            </p>
            <button onClick={completeLiveness} className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <Loader2 size={20} className="animate-spin" /> : <><CheckCircle2 size={20} /> Complete Verification</>}
            </button>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--success)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-md)' }}>
              <CheckCircle2 size={32} color="white" />
            </div>
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Verification Complete!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
              Your identity has been verified. You can now generate ZK proofs.
            </p>
            <button onClick={() => navigate('/proofs/generate')} className="btn btn-primary btn-lg">
              <Fingerprint size={20} /> Generate Your First Proof
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYC;
