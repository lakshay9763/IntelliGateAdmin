import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setAuth } from '../../features/auth/auth.slice'; // Your Redux action
import adminApi from '../../api/adminApi';

const COLORS = { purple: '#7C6AF5', purpleLight: '#EEF0FF' };

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Hit the backend. The backend verifies credentials and sets the httpOnly cookie.
      const response = await adminApi.post('/login', { email, password });
      
      // 2. Update global Redux state with the admin details
      dispatch(setAuth(response.data.admin)); 
      
      // 3. Navigate to the dashboard (React Router will allow this now that isAuthenticated is true)
      navigate('/'); 

    } catch (err) {
      // Display error message from backend, or a generic fallback
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F8F9FD', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
        
        {/* Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🛡️</div>
          <h1 style={{ margin: 0, fontSize: 24, color: '#111', fontWeight: '900' }}>IntelliGate</h1>
          <p style={{ color: '#888', fontSize: 14, marginTop: 5 }}>Admin Web Portal</p>
        </div>

        {/* Error Message Banner */}
        {error && (
          <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '12px', borderRadius: '12px', fontSize: '13px', marginBottom: '20px', textAlign: 'center', fontWeight: '600', border: '1px solid #FECACA' }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: '800', color: '#888', letterSpacing: 0.5 }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '14px', marginTop: '6px', boxSizing: 'border-box' }}
              placeholder="admin@society.com"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: 11, fontWeight: '800', color: '#888', letterSpacing: 0.5 }}>PASSWORD</label>
              <span style={{ fontSize: 11, color: COLORS.purple, fontWeight: '700', cursor: 'pointer' }}>Forgot?</span>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '14px', marginTop: '6px', boxSizing: 'border-box' }}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: COLORS.purple, color: '#fff', padding: '16px', borderRadius: '12px', 
              fontSize: '15px', fontWeight: '800', border: 'none', cursor: 'pointer', marginTop: '10px',
              opacity: loading ? 0.7 : 1, transition: 'all 0.2s'
            }}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;