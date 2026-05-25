import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import adminApi from '../api/adminApi';

export default function Admins() {
  const { user } = useSelector(state => state.auth); // Get current logged-in admin
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🚀 Modal & Form State
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [addLoading, setAddLoading] = useState(false);

  // 1. Fetch all admins on page load
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await adminApi.get('/all'); 
      setAdmins(response.data.admins);
    } catch (err) {
      setError('Failed to load admins.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Admin Deletion
  // 2. Handle Admin Deletion
  const handleDelete = async (adminId, adminName) => {
    // 🚨 SECURITY CHECK: Only superadmins can delete
    if (user.role !== 'superadmin') {
      alert("Permission Denied: Only Super Admins can delete staff members.");
      return;
    }

    // Prevent deleting yourself
    if (adminId === user.id) {
      alert("You cannot delete your own account while logged in!");
      return;
    }

    if (!window.confirm(`Are you absolutely sure you want to delete ${adminName}? This cannot be undone.`)) {
      return;
    }

    try {
      await adminApi.delete('/remove',{data:{adminId}});
      setAdmins(prev => prev.filter(admin => admin._id !== adminId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete admin');
    }
  };

  // 3. 🚀 Handle Adding New Admin
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      // The exact payload you requested
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password, // or 'password' depending on your backend schema
        role: formData.role
      };

      // Hit the create route (ensure you have this built in your node backend!)
      const response = await adminApi.post('/create', payload); 
      
      // Add the new admin to the top of our table list
      setAdmins([response.data.admin, ...admins]); 
      
      // Close modal and clear form
      setIsAdding(false);
      setFormData({ name: '', email: '', password: '', role: 'manager' });

    } catch (err) {
        console.log(error);
      alert(err.response?.data?.message || 'Failed to create new admin.');
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading admin records...</div>;

  return (
    <div style={{ position: 'relative' }}>
      
      {/* 🚀 THE ADD ADMIN MODAL OVERLAY */}
      {isAdding && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 
        }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', fontWeight: '800' }}>Add New Admin</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#888' }}>Create credentials for a new staff member.</p>
            
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#888' }}>FULL NAME</label>
                <input 
                  type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '14px', marginTop: '6px', boxSizing: 'border-box' }}
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#888' }}>EMAIL ADDRESS</label>
                <input 
                  type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '14px', marginTop: '6px', boxSizing: 'border-box' }}
                  placeholder="manager@society.com"
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#888' }}>PASSWORD</label>
                <input 
                  type="password" required value={formData.password} minLength={6} onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '14px', marginTop: '6px', boxSizing: 'border-box' }}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#888' }}>ROLE</label>
                <select 
                  value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '14px', marginTop: '6px', boxSizing: 'border-box', cursor: 'pointer' }}
                >
                  {/* <option value="manager">Manager</option> */}
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '14px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={addLoading} style={{ flex: 1, padding: '14px', background: '#7C6AF5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', opacity: addLoading ? 0.7 : 1 }}>
                  {addLoading ? 'Creating...' : 'Create Admin'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 🚀 THE MAIN DASHBOARD VIEW */}
      <div style={{ background: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111' }}>Admin Management</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#888', marginTop: '4px' }}>Manage portal access</p>
          </div>
          
          <button 
            onClick={() => setIsAdding(true)} 
            style={{ background: '#7C6AF5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: '0.2s' }}
          >
            + Add New Admin
          </button>
        </div>

        {error && <div style={{ color: '#DC2626', background: '#FEE2E2', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

        {/* The Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8F9FD', color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px', borderRadius: '12px 0 0 12px' }}>Name & Email</th>
                <th style={{ padding: '16px' }}>Role</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px', borderRadius: '0 12px 12px 0', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id} style={{ borderBottom: '1px solid #F0F0F5' }}>
                  
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '700', color: '#111', fontSize: '14px' }}>
                      {admin.name} {admin._id === user.id && <span style={{ color: '#7C6AF5', fontSize: '11px', marginLeft: '5px' }}>(You)</span>}
                    </div>
                    <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>{admin.email}</div>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      background: admin.role === 'superadmin' ? '#FFF5F5' : '#EEF0FF', 
                      color: admin.role === 'superadmin' ? '#E53E3E' : '#7C6AF5',
                      padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase'
                    }}>
                      {admin.role}
                    </span>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: admin.isActive ? '#10B981' : '#9CA3AF' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: admin.isActive ? '#10B981' : '#9CA3AF' }} />
                      {admin.isActive ? 'Active' : 'Revoked'}
                    </span>
                  </td>

                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDelete(admin._id, admin.name)}
                      disabled={admin._id === user.id} 
                      style={{
                        background: admin._id === user.id ? '#F3F4F6' : '#FFF0F0',
                        color: admin._id === user.id ? '#D1D5DB' : '#E11D48',
                        border: 'none', padding: '8px 16px', borderRadius: '8px',
                        fontSize: '12px', fontWeight: 'bold', cursor: admin._id === user.id ? 'not-allowed' : 'pointer',
                        transition: '0.2s'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                  
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>No admins found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
