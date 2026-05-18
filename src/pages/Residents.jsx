import React, { useEffect, useState } from "react";
import AddResidentForm from "../components/forms/AddResidentForm";
import { Badge, Card, SectionTitle } from "../components/ui/sharedComponent";
import { COLORS } from "../styles/colors";
import { btnStyle, inputStyle, smallBtn } from "../styles/shared";
import { useDispatch, useSelector } from "react-redux";
import { addResidentThunk, getAllResident, removeResident, updateResidentThunk } from "../features/resident/residentThunks";

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
const Residents = () => {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [roleFilter, setRoleFilter] = useState('owner'); 

  // Slide-over Panel State
  const [selectedResident, setSelectedResident] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const dispatch = useDispatch();

  const residentList = useSelector(state => state.residents?.residentList) || [];
  const { error, loading } = useSelector(state => state.residents);

  useEffect(() => {
    dispatch(getAllResident());
  }, [dispatch]);

  const handleAdd = async (payload) => {
    try {
      await dispatch(addResidentThunk(payload)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setShowAdd(false);
    }
  };

  const handleManageClick = (resident) => {
    setSelectedResident(resident);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setTimeout(() => setSelectedResident(null), 300); 
  };

  const handleRemove = (resident) => {
    dispatch(removeResident({ familyId: resident.familyId, memberId: resident.memberId }));
    closeDrawer();
  };

  const handleUpdate = async (updatedData) => {
    console.log("Submitting Updated Data:", updatedData);
    // TODO: Dispatch your update thunk here when backend is ready
    await dispatch(updateResidentThunk(updatedData)).unwrap();
    // dispatch(getAllResident()); // Refresh list
  };

  const filteredResidents = residentList.filter((r) => {
    const name = r.name || '';
    const memberId = r.memberId || '';
    const familyId = r.familyId || '';

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      memberId.toLowerCase().includes(search.toLowerCase()) ||
      familyId.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'all' || r.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const formatPhone = (phone, role) => {
    if (!phone) return 'N/A';
    if (role === 'owner') return phone;
    if (phone.length <= 4) return `**${phone.slice(-2)}`;
    return `${'*'.repeat(phone.length - 4)}${phone.slice(-4)}`;
  };

  const countFamilyMembers = (familyId) => {
    return residentList.filter(r => r.familyId === familyId).length;
  };

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh' }}>

      {showAdd && <AddResidentForm onClose={() => setShowAdd(false)} onAdd={handleAdd} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <SectionTitle style={{ margin: 0 }}>Resident Management</SectionTitle>
        <button style={btnStyle(COLORS.purple)} onClick={() => setShowAdd(true)}>＋ Add Resident</button>
      </div>

      {error && (
        <div style={{
          padding: '12px 20px', backgroundColor: COLORS.redLight, color: COLORS.red,
          borderRadius: '8px', marginBottom: '20px', border: `1px solid ${COLORS.red}30`,
          fontSize: '14px', fontWeight: '500'
        }}>
          ⚠️ <strong>Error:</strong> {error}
        </div>
      )}

      <Card style={{ padding: 0, overflow: 'hidden' }}>

        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F0F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search by name, ID, or unit..."
            style={{ ...inputStyle, width: '100%', maxWidth: 340 }}
          />

          <div style={{ display: 'flex', gap: '8px', background: '#F6F7FB', padding: '4px', borderRadius: '8px' }}>
            {['owner', 'family', 'tenant', 'all'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                style={{
                  padding: '6px 14px', border: 'none', borderRadius: '6px',
                  fontSize: '12px', fontWeight: '600', textTransform: 'capitalize', cursor: 'pointer',
                  background: roleFilter === role ? COLORS.purple : 'transparent',
                  color: roleFilter === role ? '#FFF' : '#666', transition: 'all 0.2s'
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F5' }}>
                {['Member ID', 'Profile', 'Unit Details', 'Role/Relation', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#AAA', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredResidents.length > 0 ? filteredResidents.map((r, i) => (
                <tr key={r._id || r.memberId} style={{ borderBottom: i < filteredResidents.length - 1 ? '1px solid #F6F7FB' : 'none' }}>

                  <td style={{ padding: '12px 16px', fontSize: 11, color: '#AAA', fontFamily: 'monospace' }}>
                    {r.memberId}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {r.photo
                        ? <img src={r.photo} style={{ width: 36, height: 36, borderRadius: 9, objectFit: 'cover', border: `1.5px solid ${COLORS.purple}30` }} alt={r.name} />
                        : <div style={{ width: 36, height: 36, borderRadius: 9, background: COLORS.purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👤</div>
                      }
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: '#888' }}>{formatPhone(r.phone, r.role)}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>
                      Block {r.block}, Plot {r.plot}
                    </div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                      Phase {r.phase} • {r.floor} Floor
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <Badge
                      color={r.role === 'owner' ? COLORS.purple : r.role === 'family' ? COLORS.blue : COLORS.orange}
                      bg={r.role === 'owner' ? COLORS.purpleLight : r.role === 'family' ? COLORS.blueLight : COLORS.orangeLight}
                    >
                      {r.role.toUpperCase()}
                    </Badge>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 4, fontWeight: 500, textTransform: 'capitalize' }}>
                      {r.relation || '-'}
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <Badge
                      color={r.isActive ? COLORS.green : COLORS.red}
                      bg={r.isActive ? COLORS.greenLight : COLORS.redLight}
                    >
                      {r.isActive ? '● Active' : '● Inactive'}
                    </Badge>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => handleManageClick(r)}
                      style={smallBtn(COLORS.purple, COLORS.purpleLight)}
                    >
                      Manage
                    </button>
                  </td>

                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px 20px', color: '#AAA', fontSize: 14 }}>
                    No {roleFilter !== 'all' ? roleFilter : ''} records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Embedded Drawer Component */}
      <ResidentDrawer 
        resident={selectedResident} 
        isOpen={showDrawer} 
        onClose={closeDrawer} 
        onRemove={handleRemove}
        onUpdate={handleUpdate}
        familyCount={selectedResident ? countFamilyMembers(selectedResident.familyId) : 0}
      />

    </div>
  );
};

// ─── RESIDENT DRAWER COMPONENT ──────────────────────────────────────────────
const ResidentDrawer = ({ resident, isOpen, onClose, onRemove, onUpdate, familyCount }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Reset state when a new resident is selected
  useEffect(() => {
    if (resident) {
      setFormData(resident);
      setIsEditing(false);
    }
  }, [resident]);

  if (!resident) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const inputStyleLocal = {
    ...inputStyle,
    padding: '8px 12px',
    fontSize: '13px',
    marginTop: '4px',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', zIndex: 999,
          opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Drawer Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '400px', maxWidth: '100vw', background: '#fff', zIndex: 1000,
        boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #EBEBF5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 18, color: '#111' }}>
            {isEditing ? 'Edit Resident' : 'Resident Details'}
          </h2>
          {!isEditing && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888' }}>&times;</button>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* Circular Photo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30 }}>
            {resident.photo ? (
              <img src={resident.photo} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${COLORS.purple}40`, marginBottom: 16 }} alt="Profile" />
            ) : (
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: COLORS.purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, border: `3px solid ${COLORS.purple}40`, marginBottom: 16 }}>👤</div>
            )}
            
            {isEditing ? (
              <input name="name" value={formData.name || ''} onChange={handleChange} style={{ ...inputStyleLocal, textAlign: 'center', fontSize: '18px', fontWeight: 'bold', width: '80%' }} />
            ) : (
              <h3 style={{ margin: 0, fontSize: 22, color: '#111' }}>{resident.name}</h3>
            )}

            <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: 14 }}>{resident.role.toUpperCase()} • {resident.relation || 'Primary'}</p>
            <Badge color={COLORS.purple} bg={COLORS.purpleLight} style={{ marginTop: 10 }}>{resident.memberId}</Badge>
          </div>

          {/* Contact Info (Editable) */}
          <div style={{ background: '#F8FAFC', borderRadius: 16, padding: '16px', marginBottom: 24, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ margin: 0, fontSize: 12, textTransform: 'uppercase', color: '#64748B', letterSpacing: 0.5 }}>Contact Info</h4>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: COLORS.purple, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Edit</button>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <span style={{ color: '#888', fontSize: 13 }}>Phone</span>
                {isEditing ? (
                  <input name="phone" value={formData.phone || ''} onChange={handleChange} style={inputStyleLocal} />
                ) : (
                  <div style={{ color: '#111', fontWeight: 600, fontSize: 13, marginTop: 4 }}>{resident.phone || '—'}</div>
                )}
              </div>
              <div>
                <span style={{ color: '#888', fontSize: 13 }}>Email</span>
                {isEditing ? (
                  <input name="email" value={formData.email || ''} onChange={handleChange} style={inputStyleLocal} />
                ) : (
                  <div style={{ color: '#111', fontWeight: 600, fontSize: 13, marginTop: 4 }}>{resident.email || '—'}</div>
                )}
              </div>
            </div>
          </div>

          {/* Unit & Family Details (LOCKED) */}
          <div style={{ background: '#F8FAFC', borderRadius: 16, padding: '16px', marginBottom: 24, border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 12, textTransform: 'uppercase', color: '#64748B', letterSpacing: 0.5 }}>Unit Details</h4>
            
            {/* 🛑 Warning Banner shown ONLY when editing */}
            {isEditing && (
              <div style={{ padding: '10px 12px', backgroundColor: '#FFFBEB', color: '#D97706', borderRadius: '8px', fontSize: '12px', marginBottom: '16px', border: '1px solid #FDE68A', lineHeight: '1.4' }}>
                ℹ️ <strong>Address Locked:</strong> To prevent data corruption, unit details cannot be edited. If this resident moved flats, please remove them and create a new record.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 13 }}>Location</span>
                <span style={{ color: '#111', fontWeight: 600, fontSize: 13, opacity: isEditing ? 0.6 : 1 }}>Ph {resident.phase}, Blk {resident.block}, Plt {resident.plot}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 13 }}>Floor</span>
                <span style={{ color: '#111', fontWeight: 600, fontSize: 13, opacity: isEditing ? 0.6 : 1 }}>{resident.floor}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 13 }}>Family Members</span>
                <span style={{ color: '#111', fontWeight: 600, fontSize: 13, opacity: isEditing ? 0.6 : 1 }}>{familyCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #EBEBF5', background: '#FAFAFA', display: 'flex', gap: 10 }}>
          {isEditing ? (
            <>
              <button 
                onClick={() => {
                  setFormData(resident); // Revert changes
                  setIsEditing(false);
                }} 
                style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#E2E8F0', color: '#475569', border: 'none', fontWeight: '700', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                style={{ flex: 1, padding: '14px', borderRadius: '12px', background: COLORS.purple, color: '#FFF', border: 'none', fontWeight: '700', cursor: 'pointer' }}
              >
                Save Changes
              </button>
            </>
          ) : resident.role === 'family' ? (
            /* Family Member Restriction Notice */
            <div style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', fontSize: '13px', textAlign: 'center', lineHeight: '1.4' }}>
              🚫 <strong>Action Not Allowed:</strong> Admins cannot directly remove family members. The Flat Owner must remove them, or you can delete the Owner to clear all associated members.
            </div>
          ) : (
            <button
              onClick={() => {
                const isOwner = resident.role === 'owner';
                const warningMessage = isOwner
                  ? `🚨 WARNING: ${resident.name} is the Owner. Removing them will also permanently delete ALL family members, tenants, and active passes for Flat ${resident.familyId}. Proceed?`
                  : `Are you sure you want to revoke access and remove ${resident.name}?`;

                if (window.confirm(warningMessage)) {
                  onRemove(resident);
                }
              }}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA',
                fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#FECACA'}
              onMouseOut={(e) => e.currentTarget.style.background = '#FEE2E2'}
            >
              Revoke Access & Remove
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Residents;