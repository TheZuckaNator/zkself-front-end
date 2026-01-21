import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  User, 
  LogOut, 
  FileCheck, 
  Settings, 
  Home,
  Fingerprint
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <div className="logo">
            <Shield size={18} />
          </div>
          <span>zkSelf</span>
        </Link>

        <div className="navbar-nav">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className="nav-link">
                <Home size={16} />
                Dashboard
              </NavLink>
              <NavLink to="/proofs" className="nav-link">
                <FileCheck size={16} />
                Proofs
              </NavLink>
              <NavLink to="/kyc" className="nav-link">
                <Fingerprint size={16} />
                KYC
              </NavLink>
              <NavLink to="/settings" className="nav-link">
                <Settings size={16} />
                Settings
              </NavLink>
              
              <div className="nav-divider" style={{ 
                width: '1px', 
                height: '24px', 
                background: 'var(--border-primary)',
                margin: '0 8px'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '4px 12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem'
                }}>
                  <User size={14} />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {user?.username || user?.email?.split('@')[0]}
                  </span>
                  {user?.kycStatus === 'verified' && (
                    <span className="badge badge-success" style={{ padding: '2px 6px', fontSize: '0.625rem' }}>
                      KYC
                    </span>
                  )}
                </div>
                
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  <LogOut size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
