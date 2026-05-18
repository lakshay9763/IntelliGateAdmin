import React, { useEffect, useState } from "react";
import { Badge, Card, SectionTitle, Toggle } from "../components/ui/sharedComponent";
import { COLORS } from "../styles/colors";
import { btnStyle, smallBtn } from "../styles/shared";
import { useDispatch, useSelector } from "react-redux";
import { getAllUtilityWorker } from "../features/utility_worker/utility.thunk";
import { getStaffDetails, removeStaff } from "../features/staff/staff.thunk";

// Dynamic Theme Configuration aligned with your Schema Enums
const CATEGORY_CFG = {
  maid:        { label: 'Maid',      icon: '🧹', color: '#8A2BE2', light: '#F4EBFF' }, 
  driver:      { label: 'Driver',    icon: '🚕', color: '#FFB800', light: '#FFF9E6' }, 
  cook:        { label: 'Cook',      icon: '🧑‍🍳', color: '#00C48C', light: '#E6FAF4' }, 
  nanny:       { label: 'Nanny',     icon: '🍼', color: '#FF6B6B', light: '#FFEBEB' }, 
  gardener:    { label: 'Gardener',  icon: '🪴', color: '#20B2AA', light: '#E8F7F6' }, 
  sweeper:     { label: 'Sweeper',   icon: '🪣', color: '#4169E1', light: '#ECF0FC' }, 
  security:    { label: 'Security',  icon: '🛡️', color: '#DC143C', light: '#FCE7EB' }, 
  maintenance: { label: 'Maintenance', icon: '🔧', color: '#708090', light: '#F0F2F4' }, 
  other:       { label: 'Other',     icon: '💼', color: '#A9A9A9', light: '#F5F5F5' }  
};

// Date formatter helpers
const formatDate = (isoString) => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Extracts ONLY the date: "May 13, 2026"
const formatJustDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  } catch (e) { return dateString; }
};

// Extracts ONLY the time: "07:41 AM"
const formatJustTime = (timeString) => {
  if (!timeString) return null;
  try {
    const date = new Date(timeString);
    return isNaN(date.getTime()) ? timeString : date.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  } catch (e) { return timeString; }
};

const StaffManagement = () => {
  const dispatch = useDispatch();

  // Pulling dynamic data from Redux
  const staffList = useSelector(state => state.staff.data?.staffList) || [];
  
  const {logs,houses} = useSelector(state => state.staff.data.staffDeatils)


  // Local state for Toggle and Filters
  const [localEntryState, setLocalEntryState] = useState({});
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' or category key

  // Drawer State
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
     dispatch(getAllUtilityWorker())
  }, [dispatch]);

  // Sync local toggle state when Redux data loads
  useEffect(() => {
    if (staffList.length > 0) {
      const initialStates = {};
      staffList.forEach(s => {
        initialStates[s.staffId] = true; 
      });
      setLocalEntryState(initialStates);
    }
  }, [staffList]);

  const formatScopeOfWork = (scopeArray) => {
    if (!scopeArray || scopeArray.length === 0) return <span style={{ color: '#CCC' }}>Unassigned</span>;
    if (scopeArray.length <= 2) return scopeArray.join(', ');
    return `${scopeArray[0]}, ${scopeArray[1]} +${scopeArray.length - 2} more`;
  };

  // Drawer Handlers
  const handleViewClick = (worker) => {

    console.log(worker);
    dispatch(getStaffDetails({staffId : worker.staffId,documentId:worker._id})) 
    setSelectedWorker(worker);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setTimeout(() => setSelectedWorker(null), 300); // Wait for slide animation
  };


  const handleRemove = (worker) => {
    console.log("Removing worker:", worker.staffId);
    dispatch(removeStaff({documentId:worker._id,staffId:worker.staffId}));
  };

  // 1. Identify which categories actually exist in the current data
  const presentCategories = [...new Set(staffList.map(s => s.category?.toLowerCase() || 'other'))];
  
  // 2. Generate filter options maintaining the order from CATEGORY_CFG
  const filterOptions = ['all', ...Object.keys(CATEGORY_CFG).filter(k => presentCategories.includes(k))];

  // 3. Filter the staff list based on the active tab
  const filteredStaff = staffList.filter(s => {
    if (activeFilter === 'all') return true;
    const cat = s.category?.toLowerCase() || 'other';
    return cat === activeFilter;
  });

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <SectionTitle style={{ margin: 0 }}>Staff Management</SectionTitle>
        {/* <button style={btnStyle(COLORS.green)}>＋ Add Staff</button> */}
      </div>

      {/* Dynamic Filter Bar */}
      <div style={{ 
        display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', 
        background: '#fff', padding: '10px', borderRadius: 16, border: '1px solid #EBEBF5' 
      }}>
        {filterOptions.map(catKey => {
          const isActive = activeFilter === catKey;
          const isAll = catKey === 'all';
          const r = CATEGORY_CFG[catKey];
          
          return (
            <button
              key={catKey}
              onClick={() => setActiveFilter(catKey)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px',
                borderRadius: 12,
                border: `1.5px solid ${isActive ? COLORS.purple : 'transparent'}`,
                background: isActive ? COLORS.purple : '#F6F7FB',
                color: isActive ? '#FFF' : '#666',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              {!isAll && <span style={{ fontSize: 14 }}>{r.icon}</span>}
              {isAll ? 'All Staff' : r.label}
              
              <span style={{ 
                background: isActive ? 'rgba(255,255,255,0.2)' : '#EBEBF5', 
                color: isActive ? '#FFF' : '#888',
                padding: '2px 6px', borderRadius: 6, fontSize: 11, marginLeft: 4 
              }}>
                {isAll ? staffList.length : staffList.filter(s => (s.category?.toLowerCase() || 'other') === catKey).length}
              </span>
            </button>
          );
        })}
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F5' }}>
                {['ID', 'Profile', 'Role', 'Since', 'Scope of Work', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#AAA', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length > 0 ? filteredStaff.map((s, i) => {
                const catKey = s.category?.toLowerCase() || 'other';
                const r = CATEGORY_CFG[catKey] || CATEGORY_CFG['other'];

                return (
                  <tr key={s.staffId || i} style={{ borderBottom: i < filteredStaff.length - 1 ? '1px solid #F6F7FB' : 'none', transition: 'all 0.2s' }}>
                    
                    {/* ID */}
                    <td style={{ padding: '12px 16px', fontSize: 11, color: '#AAA', fontFamily: 'monospace' }}>
                      {s.staffId}
                    </td>
                    
                    {/* Profile & Name */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {s.photo ? (
                          <img src={s.photo} style={{ width: 32, height: 32, borderRadius: 9, objectFit: 'cover' }} alt={s.name} />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: 9, background: '#F0F0F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                            {r.icon}
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: '#888' }}>{s.phone}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: '12px 16px' }}>
                      <Badge color={r.color} bg={r.light}>
                        {s.category === 'other' && s.otherType ? s.otherType : r.label}
                      </Badge>
                    </td>

                    {/* Since */}
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#555', fontWeight: 600 }}>
                      {formatDate(s.createdAt)}
                    </td>

                    {/* Scope of Work */}
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#555', fontWeight: 600 }}>
                      {formatScopeOfWork(s.scopeOfWork)}
                      {s.activeHousesCount > 0 && (
                        <div style={{ fontSize: 10, color: '#AAA', marginTop: 2, fontWeight: 500 }}>
                          ({s.activeHousesCount} active)
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px' }}>
                      <button 
                        onClick={() => handleViewClick(s)}
                        style={smallBtn(COLORS.purple, COLORS.purpleLight)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px 20px', color: '#AAA', fontSize: 14 }}>
                    No staff found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Embedded Worker Drawer */}
      <WorkerDrawer 
        worker={selectedWorker} 
        isOpen={showDrawer} 
        onClose={closeDrawer} 
        // onBlacklist={handleBlacklist}
        onRemove={handleRemove}
        activeFlats={selectedWorker?.scopeOfWork || []}
        logs={logs}
        houses={houses}
      />
    </div>
  );
};

// ─── WORKER DRAWER COMPONENT ──────────────────────────────────────────────
const WorkerDrawer = ({ worker, isOpen, onClose, onRemove, logs = [], houses = [] }) => {
  if (!worker) return null;

  const catKey = worker.category?.toLowerCase() || 'other';
  const r = CATEGORY_CFG[catKey] || CATEGORY_CFG['other'];

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
        width: '420px', maxWidth: '100vw', background: '#fff', zIndex: 1000,
        boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #EBEBF5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 18, color: '#111' }}>Worker Profile</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888' }}>&times;</button>
        </div>

        {/* Body (Scrollable) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* Big Circular Photo & Identity */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
            {worker.photo ? (
              <img src={worker.photo} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${r.color}40`, marginBottom: 16 }} alt={worker.name} />
            ) : (
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: r.light, color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, border: `3px solid ${r.color}40`, marginBottom: 16 }}>
                {r.icon}
              </div>
            )}
            
            <h3 style={{ margin: 0, fontSize: 22, color: '#111', marginBottom: 6 }}>{worker.name || worker.workerName}</h3>
            
            <Badge color={r.color} bg={r.light} style={{ marginBottom: 12 }}>
              {worker.category === 'other' && worker.otherType ? worker.otherType.toUpperCase() : r.label.toUpperCase()}
            </Badge>

            <div style={{ color: '#64748B', fontSize: 13, fontWeight: '500' }}>
              Worker ID: <span style={{ fontFamily: 'monospace' }}>{worker.staffId || worker.serviceStaffId || 'N/A'}</span>
            </div>
          </div>

          {/* Details Section */}
          <div style={{ background: '#F8FAFC', borderRadius: 16, padding: '16px', marginBottom: 20, border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 12, textTransform: 'uppercase', color: '#64748B', letterSpacing: 0.5 }}>Details</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 13 }}>Phone</span>
                <span style={{ color: '#111', fontWeight: 600, fontSize: 13 }}>{worker.phone || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 13 }}>Registered Since</span>
                <span style={{ color: '#111', fontWeight: 600, fontSize: 13 }}>{formatDate(worker.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Linked Flats / Families (Now using Redux `houses`) */}
          <div style={{ background: '#F8FAFC', borderRadius: 16, padding: '16px', marginBottom: 20, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ margin: 0, fontSize: 12, textTransform: 'uppercase', color: '#64748B', letterSpacing: 0.5 }}>
                Linked Flats
              </h4>
              <Badge color={COLORS.blue} bg={COLORS.blueLight}>
                {houses?.length || 0} Active
              </Badge>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {houses && houses.length > 0 ? houses.map((house, idx) => (
                <div key={idx} style={{ 
                  padding: '6px 12px', background: '#fff', border: '1px solid #E2E8F0', 
                  borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#334155',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  🏠 {house.familyId || house.flatNumber || house} 
                </div>
              )) : (
                <span style={{ fontSize: 13, color: '#888' }}>No active flats linked.</span>
              )}
            </div>
          </div>

          {/* Current Month Entry Logs (Updated to match Utility Style) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ margin: 0, fontSize: 12, textTransform: 'uppercase', color: '#64748B', letterSpacing: 0.5 }}>Activity Logs</h4>
              <span style={{ fontSize: 11, color: '#888', fontWeight: '600' }}>{logs?.length || 0} Records</span>
            </div>
            
            {logs && logs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {logs.map((log, idx) => (
                  <div key={log._id || idx} style={{ 
                    background: '#F8FAFC', borderRadius: '12px', 
                    border: '1px solid #E2E8F0', overflow: 'hidden'
                  }}>
                    
                    {/* TOP ROW: Date & Visited Flat */}
                    <div style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      background: '#F1F5F9', padding: '10px 14px', borderBottom: '1px solid #E2E8F0' 
                    }}>
                      <span style={{ fontSize: 12, color: '#475569', fontWeight: '700' }}>
                        📅 {formatJustDate(log.entryTime)}
                      </span>
                      {log.familyId && (
                        <div style={{ 
                          background: '#fff', border: '1px solid #CBD5E1', padding: '4px 8px', 
                          borderRadius: '6px', fontSize: '11px', fontWeight: '700', color: COLORS.purple 
                        }}>
                          🏠 Flat {log.familyId}
                        </div>
                      )}
                    </div>

                    {/* BOTTOM ROW: In & Out Times */}
                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        
                        {/* Entry Time */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.green }} />
                          <span style={{ fontSize: 13, color: '#334155', fontWeight: '600' }}>
                            In: <span style={{ color: '#111' }}>{formatJustTime(log.entryTime) || '—'}</span>
                          </span>
                        </div>

                        {/* Exit Time */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: log.exitTime ? COLORS.red : '#F59E0B' }} />
                          <span style={{ fontSize: 13, color: log.exitTime ? '#334155' : '#D97706', fontWeight: '600' }}>
                            Out: <span style={{ color: log.exitTime ? '#111' : '#D97706' }}>
                              {formatJustTime(log.exitTime) || 'Inside'}
                            </span>
                          </span>
                        </div>
                        
                      </div>

                      {/* Total Time */}
                      {log.totalTime && (
                        <div style={{ 
                          marginTop: 4, paddingTop: 10, borderTop: '1px dashed #CBD5E1',
                          fontSize: 12, color: '#64748B', fontWeight: '600', display: 'flex', alignItems: 'center', gap: 4
                        }}>
                          ⏱️ Duration: <span style={{ color: COLORS.purple }}>{log.totalTime}</span>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '12px', 
                padding: '30px 20px', textAlign: 'center', color: '#94A3B8', fontSize: '13px'
              }}>
                No entry logs found for this month.
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #EBEBF5', background: '#FAFAFA', display: 'flex', gap: 10 }}>
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to completely remove ${worker.name}?`)) {
                if(onRemove) onRemove(worker);
                onClose();
              }
            }}
            style={{
              flex: 1, padding: '14px', borderRadius: '12px',
              background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA',
              fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            🗑️ Remove 
          </button>
        </div>
      </div>
    </>
  );
};

export default StaffManagement;