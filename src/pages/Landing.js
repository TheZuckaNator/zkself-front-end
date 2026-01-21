import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, ArrowRight, Fingerprint, Lock, Globe, User,
  CheckCircle2, Zap, Code, Database
} from 'lucide-react';

const Landing = () => {
  const features = [
    { icon: Fingerprint, title: 'Verify Once', description: 'Complete KYC verification one time with our partner Synapse Analytics' },
    { icon: Lock, title: 'Prove Anything', description: 'Generate ZK proofs for age, humanity, country, and more' },
    { icon: Shield, title: 'Reveal Nothing', description: 'Verifiers only see yes/no answers, never your personal data' }
  ];

  const useCases = [
    { icon: Zap, title: 'Airdrops', description: 'Anti-sybil protection without doxxing' },
    { icon: Globe, title: 'DeFi Compliance', description: 'Prove non-sanctioned status for protocols' },
    { icon: User, title: 'Age Verification', description: 'Prove 18+/21+ for regulated services' },
    { icon: Database, title: 'DAO Voting', description: 'One person = one vote, verifiably' }
  ];

  return (
    <div className="page">
      {/* Hero Section */}
      <section style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(ellipse at center, rgba(198, 255, 0, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-xs) var(--spacing-md)',
            background: 'rgba(198, 255, 0, 0.1)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-full)',
            marginBottom: 'var(--spacing-lg)',
            fontSize: '0.875rem',
            color: 'var(--primary)'
          }}>
            <Zap size={14} />
            Privacy-first identity for Web3
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            lineHeight: 1.1,
            marginBottom: 'var(--spacing-lg)',
            maxWidth: '800px',
            margin: '0 auto var(--spacing-lg)'
          }}>
            Prove Everything.
            <br />
            <span style={{ color: 'var(--primary)' }}>Reveal Nothing.</span>
          </h1>

          <p style={{ 
            fontSize: '1.25rem', 
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto var(--spacing-xl)'
          }}>
            Zero-knowledge identity verification. Verify once with KYC, 
            then generate cryptographic proofs without exposing your personal data.
          </p>

          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-primary btn-lg glow">
              Get Started
              <ArrowRight size={20} />
            </Link>
            <a href="#how-it-works" className="btn btn-secondary btn-lg">
              Learn More
            </a>
          </div>

          {/* Terminal Preview */}
          <div className="terminal" style={{ maxWidth: '500px', margin: 'var(--spacing-2xl) auto 0', textAlign: 'left' }}>
            <div className="terminal-header">
              <div className="terminal-dot red" />
              <div className="terminal-dot yellow" />
              <div className="terminal-dot green" />
            </div>
            <div className="terminal-body">
              <div className="terminal-line">
                <span className="terminal-prompt">$</span>
                <span className="terminal-command">zkself prove age_over_18</span>
              </div>
              <div className="terminal-output" style={{ marginTop: 'var(--spacing-sm)' }}>
                ✓ Generating ZK proof...<br />
                ✓ Proof generated in 142ms<br />
                ✓ Nullifier: 0x7f3a...2b1c<br />
                <span style={{ color: 'var(--primary)' }}>→ Ready for verification</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: 'var(--spacing-2xl) 0' }}>
        <div className="container">
          <div className="grid grid-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="card" style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '56px', height: '56px',
                    background: 'var(--gradient-primary)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto var(--spacing-md)',
                    boxShadow: 'var(--shadow-glow)'
                  }}>
                    <Icon size={28} color="var(--bg-primary)" />
                  </div>
                  <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" style={{ padding: 'var(--spacing-2xl) 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>How It Works</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            {/* Line connector */}
            <div style={{ position: 'absolute', top: '28px', left: '60px', right: '60px', height: '2px', background: 'var(--border-primary)' }} />
            
            {[
              { num: 1, title: 'Sign Up', desc: 'Create your zkSelf account' },
              { num: 2, title: 'Verify KYC', desc: 'Complete identity verification' },
              { num: 3, title: 'Generate Proofs', desc: 'Create ZK proofs for your attributes' },
              { num: 4, title: 'Use Anywhere', desc: 'Verify on-chain or off-chain' }
            ].map((step, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '56px', height: '56px',
                  borderRadius: '50%',
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--spacing-md)',
                  fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {step.num}
                </div>
                <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{step.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ padding: 'var(--spacing-2xl) 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-sm)' }}>Use Cases</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-2xl)' }}>
            Privacy-preserving verification for the entire Web3 ecosystem
          </p>

          <div className="grid grid-4">
            {useCases.map((uc, i) => {
              const Icon = uc.icon;
              return (
                <div key={i} style={{
                  padding: 'var(--spacing-lg)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all var(--transition-fast)'
                }}>
                  <Icon size={24} style={{ color: 'var(--primary)', marginBottom: 'var(--spacing-sm)' }} />
                  <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{uc.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>{uc.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: 'var(--spacing-2xl) 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Ready to protect your privacy?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)', maxWidth: '500px', margin: '0 auto var(--spacing-xl)' }}>
            Join the future of privacy-preserving identity verification
          </p>
          <Link to="/signup" className="btn btn-primary btn-lg glow">
            Create Your Account
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-primary)', padding: 'var(--spacing-xl) 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Shield size={20} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: '600' }}>zkSelf</span>
          </div>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', margin: 0 }}>
            © 2024 zkSelf. Privacy-first identity for Web3.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
