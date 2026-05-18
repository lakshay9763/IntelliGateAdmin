import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Page Imports
import Dashboard from './src/pages/Dashboard';
import SocietySetup from './src/pages/SocietySetup';
import Residents from './src/pages/Residents';
import StaffManagement from './src/pages/StaffManagement';
import Utility from './src/pages/Utility';
import Guards from './src/pages/Guards';
import AccessPolicies from './src/pages/AccessPolicies';
import Reports from './src/pages/Reports';
import adminApi from './src/api/adminApi';
import { setAuth } from './src/features/auth/auth.slice';
import Admins from './src/pages/Admins';

const NAV = [
  { id: 'dashboard',  label: 'Dashboard',      icon: '📊' },
  { id: 'setup',      label: 'Society Setup',  icon: '🏗️' },
  { id: 'residents',  label: 'Residents',      icon: '👨‍👩‍👧' },
  { id: 'staff',      label: 'Staff',          icon: '👷' },
  { id: 'utility',    label: 'Utility',        icon: '🔧'},
  { id: 'gate_device',label: 'Devices',        icon: '👮' },
  { id: 'admin',      label: 'Admins',         icon: '🔐' },
  // { id: 'reports',    label: 'Reports',        icon: '📈' },
];

export default function AdminDashboard() {
  const [active, setActive] = useState('dashboard');
  
  // 🚀 Redux & Router Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // 🚀 Logout Handler
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to securely log out?")) return;

    try {
      // Tell backend to destroy the session and clear the HTTP-only cookie
      await adminApi.post('/logout'); 
    } catch (error) {
      console.error("Server logout failed, but forcing local logout.", error);
    } finally {
      dispatch(setAuth(null));
      navigate('/login');
    }
  };

  const renderSection = () => {
    switch (active) {
      case 'dashboard':   return <Dashboard />;
      case 'setup':       return <SocietySetup />;
      case 'residents':   return <Residents />;
      case 'staff':       return <StaffManagement />;
      case 'policies':    return <AccessPolicies />;
      case 'utility':     return <Utility/>;  
      case 'gate_device': return <Guards/>;
      case 'reports':     return <Reports />;
      case 'admin' : return <Admins/>
      default:            return <Dashboard />;

    }
  };

  return (
    <div style={styles.container}>

      {/* Sidebar */}
      <div style={styles.sidebar}>

        {/* Brand */}
        <div style={styles.brandContainer}>
          <div style={styles.brandBadge}>
            <span>🏢</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#7C6AF5' }}>
              BLF Admin
            </span>
          </div>
          <div style={styles.brandTitle}>Society Portal</div>
          <div style={styles.brandSubtitle}>Block A · B · C</div>
        </div>

        {/* Navigation */}
        <div style={styles.navContainer}>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              style={{
                ...styles.navButton,
                ...(active === n.id ? styles.navActive : {}),
              }}
            >
              <span style={{ width: 22 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>

        {/* Admin Footer & Logout */}
        <div style={{ borderTop: '1px solid #F0F0F5', paddingBottom: '16px' }}>
          
          {/* User Info from Redux */}
          <div style={styles.adminFooter}>
            <div style={styles.avatar}>👤</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Admin'}
              </div>
              <div style={{ fontSize: 11, color: '#AAA', textTransform: 'capitalize' }}>
                {user?.role ? user.role.replace('superadmin', 'Super Admin') : 'Manager'}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 Sign Out
          </button>

        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>

        {/* Top Bar */}
        <div style={styles.topBar}>
          <div>
            <div style={{ fontSize: 11, color: '#AAA', fontWeight: 600 }}>
              BLF Society App
            </div>
            <div style={styles.pageTitle}>
              {NAV.find(n => n.id === active)?.label}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 12, color: '#AAA', fontWeight: '500' }}>
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long', day: 'numeric', month: 'long',
              })}
            </div>
          </div>
        </div>

        {renderSection()}

      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'DM Sans, sans-serif',
    background: '#F6F7FB',
  },

  sidebar: {
    width: 230,
    minHeight: '100vh',
    background: '#fff',
    borderRight: '1px solid #EBEBF5',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 10,
  },

  brandContainer: {
    padding: '20px 18px 16px',
    borderBottom: '1px solid #F0F0F5',
  },

  brandBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: '#EEF0FF',
    borderRadius: 10,
    padding: '5px 10px',
    marginBottom: 8,
  },

  brandTitle: { fontSize: 18, fontWeight: 800, color: '#111' },
  brandSubtitle: { fontSize: 11, color: '#AAA', fontWeight: 500, marginTop: 2 },

  navContainer: {
    flex: 1, // Pushes everything below it to the bottom of the screen
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    overflowY: 'auto'
  },

  navButton: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
    borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 600,
    color: '#888', background: 'transparent', border: 'none', width: '100%',
    textAlign: 'left', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
  },

  navActive: {
    fontWeight: 800, color: '#7C6AF5', background: '#EEF0FF',
  },

  adminFooter: {
    padding: '16px 18px',
    display: 'flex', alignItems: 'center', gap: 10,
  },

  avatar: {
    width: 36, height: 36, borderRadius: 10, background: '#F8FAFC',
    border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 18,
  },

  // 🚀 New Beautiful Logout Button
  logoutBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    width: 'calc(100% - 36px)', margin: '0 auto', padding: '12px',
    background: '#fad6d6', color: '#E11D48', border: '1px solid #FFE4E6',
    borderRadius: '12px', fontSize: '13px', fontWeight: '800',
    cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'DM Sans, sans-serif'
  },

  main: {
    marginLeft: 230, flex: 1, padding: 28, minHeight: '100vh', overflowY: 'auto',
  },

  topBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #EBEBF5',
  },

  pageTitle: { fontSize: 22, fontWeight: 800, color: '#111', marginTop: 2 },
};