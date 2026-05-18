import { useEffect, useState } from "react";
import { Badge, Card, SectionTitle, Toggle } from "../components/ui/sharedComponent";
import { COLORS } from "../styles/colors";
import { btnStyle, smallBtn } from "../styles/shared";
import { useDispatch, useSelector } from "react-redux";
import { 
  getAllUtilityWorker, 
  getUtilityDetails, 
  removeUtilityWorker, 
  updateUtilityAccess,
  // 🚀 Make sure to create/export these from your utility.thunk file
  // getUtilityDetails, 
  // removeUtilityWorkerThunk 
} from "../features/utility_worker/utility.thunk";

// Dynamic Theme Configuration aligned with Utility Schema Enums
const CATEGORY_CFG = {
  electrician: { label: 'Electrician',  icon: '⚡', color: '#FFB800', light: '#FFF9E6' },
  plumber:     { label: 'Plumber',      icon: '🔧', color: '#4169E1', light: '#ECF0FC' },
  carpenter:   { label: 'Carpenter',    icon: '🪚', color: '#8B4513', light: '#F5DEB3' },
  pest:        { label: 'Pest Control', icon: '🐛', color: '#00C48C', light: '#E6FAF4' },
  ac:          { label: 'AC Service',   icon: '❄️', color: '#20B2AA', light: '#E8F7F6' },
  ro:          { label: 'RO Service',   icon: '💧', color: '#00BFFF', light: '#E0FFFF' },
  other:       { label: 'Other',        icon: '💼', color: '#A9A9A9', light: '#F5F5F5' }
};

// Date formatter helpers
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

const Utility = () => {
  const dispatch = useDispatch();

  // Pulling dynamic data from Redux safely
  const rawData = useSelector(state => state.utility.data);
  const utilityList = Array.isArray(rawData?.utilityList) ? rawData.utilityList : [];
  
  // 🚀 Assumes you store utility logs similarly to staff logs
  const logs = useSelector(state => state.utility.data?.utilityDetails?.logs) || [];

  // Local state
  const [localEntryState, setLocalEntryState] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Drawer State
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    dispatch(getAllUtilityWorker());
  }, [dispatch]);

  // Sync local toggle state when Redux data loads
  useEffect(() => {
    if (utilityList.length > 0) {
      const initialStates = {};
      utilityList.forEach(u => {
        initialStates[u._id] = !u.accessDenied; 
      });
      setLocalEntryState(initialStates);
    }
  }, [utilityList]);

  // --- Handlers ---
  
  const handleViewClick = (worker) => {
    console.log("Viewing Utility Worker:", worker);
    dispatch(getUtilityDetails({ utilityId: worker.utilityId, documentId: worker._id })); 
    setSelectedWorker(worker);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setTimeout(() => setSelectedWorker(null), 300);
  };

  const handleToggleAccess = async (id, currentAllowedStatus) => {
    const newAccessDeniedStatus = currentAllowedStatus; // If it WAS allowed, accessDenied becomes true
    
    // Optimistic UI update
    setLocalEntryState(prev => ({ ...prev, [id]: !currentAllowedStatus }));
    
    try {
      await dispatch(updateUtilityAccess({ 
        documentId: id, 
        accessDenied: newAccessDeniedStatus 
      })).unwrap();
    } catch (error) {
      console.error("Failed to update access status:", error);
      // Revert if API fails
      setLocalEntryState(prev => ({ ...prev, [id]: currentAllowedStatus }));
    }
  };

  const handleRemoveWorker = (worker) => {
    console.log("Removing utility worker:", worker._id);
    // 🚀 Dispatch your delete thunk here
    dispatch(removeUtilityWorker({utilityId:worker.utilityId}));
    closeDrawer();
  };

  // --- Filtering ---
  const presentCategories = [...new Set(utilityList.map(u => u.category?.toLowerCase() || 'other'))];
  const filterOptions = ['all', ...Object.keys(CATEGORY_CFG).filter(k => presentCategories.includes(k))];

  const filteredUtility = utilityList.filter(u => {
    if (activeFilter === 'all') return true;
    const cat = u.category?.toLowerCase() || 'other';
    return cat === activeFilter;
  });

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <SectionTitle style={{ margin: 0 }}>Utility Workers</SectionTitle>
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
              {isAll ? 'All Workers' : r.label}
              
              <span style={{ 
                background: isActive ? 'rgba(255,255,255,0.2)' : '#EBEBF5', 
                color: isActive ? '#FFF' : '#888',
                padding: '2px 6px', borderRadius: 6, fontSize: 11, marginLeft: 4 
              }}>
                {isAll ? utilityList.length : utilityList.filter(u => (u.category?.toLowerCase() || 'other') === catKey).length}
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
                {['ID', 'Profile', 'Role', 'Since', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#AAA', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUtility.length > 0 ? filteredUtility.map((u, i) => {
                const catKey = u.category?.toLowerCase() || 'other';
                const r = CATEGORY_CFG[catKey] || CATEGORY_CFG['other'];
                const isAllowed = localEntryState[u._id] ?? !u.accessDenied;

                return (
                  <tr key={u._id || i} style={{ borderBottom: i < filteredUtility.length - 1 ? '1px solid #F6F7FB' : 'none', transition: 'all 0.2s' }}>
                    
                    {/* ID */}
                    <td style={{ padding: '12px 16px', fontSize: 11, color: '#AAA', fontFamily: 'monospace' }}>
                      {u.utilityId || String(u._id).substring(0, 8)}
                    </td>
                    
                    {/* Profile & Name */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {u.photo ? (
                          <img src={u.photo} style={{ width: 32, height: 32, borderRadius: 9, objectFit: 'cover' }} alt={u.name} />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: 9, background: '#F0F0F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                            {r.icon}
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: '#888' }}>{u.phone}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: '12px 16px' }}>
                      <Badge color={r.color} bg={r.light}>
                        {u.category === 'other' && u.otherType ? u.otherType : r.label}
                      </Badge>
                    </td>

                    {/* Since */}
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#444', fontWeight: 500 }}>
                      {formatDate(u.createdAt || new Date())}
                    </td>

                    {/* Read-Only Status Badge */}
                    <td style={{ padding: '12px 16px' }}>
                      <Badge 
                        color={isAllowed ? COLORS.green : COLORS.red} 
                        bg={isAllowed ? COLORS.greenLight : COLORS.redLight}
                      >
                        {isAllowed ? '● Allowed' : '● Denied'}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px' }}>
                      <button 
                        onClick={() => handleViewClick(u)}
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
                    No utility workers found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Embedded Utility Drawer */}
      <UtilityDrawer 
        worker={selectedWorker} 
        isOpen={showDrawer} 
        onClose={closeDrawer} 
        onRemove={handleRemoveWorker}
        isAllowed={selectedWorker ? (localEntryState[selectedWorker._id] ?? !selectedWorker.accessDenied) : false}
        onToggleAccess={handleToggleAccess}
        logs={logs}
      />
    </div>
  );
};

// ─── UTILITY DRAWER COMPONENT ──────────────────────────────────────────────
const UtilityDrawer = ({ worker, isOpen, onClose, onRemove, isAllowed, onToggleAccess, logs = [] }) => {
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
          <h2 style={{ margin: 0, fontSize: 18, color: '#111' }}>Utility Worker Profile</h2>
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
              ID: <span style={{ fontFamily: 'monospace' }}>{worker.utilityId || String(worker._id).substring(0, 8)}</span>
            </div>
          </div>

          {/* Details & Access Control Section */}
          <div style={{ background: '#F8FAFC', borderRadius: 16, padding: '16px', marginBottom: 24, border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 12, textTransform: 'uppercase', color: '#64748B', letterSpacing: 0.5 }}>Details & Access</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 13 }}>Phone</span>
                <span style={{ color: '#111', fontWeight: 600, fontSize: 13 }}>{worker.phone || '—'}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 13 }}>Registered Since</span>
                <span style={{ color: '#111', fontWeight: 600, fontSize: 13 }}>{formatDate(worker.createdAt || new Date())}</span>
              </div>

              {/* Shifting the Toggle inside the Drawer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px dashed #CBD5E1' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#111', fontSize: 13, fontWeight: '700' }}>Gate Access</span>
                  <span style={{ color: '#888', fontSize: 11 }}>{isAllowed ? 'Currently allowed to enter' : 'Blocked at the gate'}</span>
                </div>
                <Toggle enabled={isAllowed} onChange={() => onToggleAccess(worker._id, isAllowed)} color={COLORS.green} />
              </div>

            </div>
          </div>

          {/* Entry Logs */}
       {/* Entry Logs */}
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

                      {/* Total Time (Optional) */}
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
                No entry logs found.
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions (Remove Button Only) */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #EBEBF5', background: '#FAFAFA' }}>
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to permanently delete ${worker.name}? This will wipe their logs and database entries.`)) {
                onRemove(worker);
              }
            }}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA',
              fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            🗑️ Delete Worker
          </button>
        </div>
      </div>
    </>
  );
};

export default Utility;