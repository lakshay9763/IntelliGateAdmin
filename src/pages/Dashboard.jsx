import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Card, SectionTitle } from "../components/ui/sharedComponent";
import { COLORS } from "../styles/colors";
import { getAllResident } from "../features/resident/residentThunks";
import { getAllStaff } from "../features/staff/staff.thunk";
import { getEntryLogs } from "../features/auth/logs.thunk";
import { getActiveVisitors } from "../features/visitor/vis.thunk";
import { getAllUtilityWorker } from "../features/utility_worker/utility.thunk";

// --- THEME CONFIGURATION ---
const NOTIF_THEMES = {
  staff: {
    maid: { label: "Maid", icon: "🧹", color: "#7C6AF5", light: "#F5F3FF" },
    driver: { label: "Driver", icon: "🚗", color: "#F59E0B", light: "#FFFBEB" },
    nanny: { label: "Nanny", icon: "👶", color: "#EC4899", light: "#FDF2F8" },
    default: { label: "Staff", icon: "👤", color: "#64748B", light: "#F8FAFC" },
    cook: { Label: 'Cook', icon: '👨‍🍳', color: '#10B981', light: '#D1FAE5' },
  },
  delivery: {
    blinkit: { label: "Blinkit", icon: "🟡", color: "#FBBF24", light: "#FFFBEB" },
    zomato: { label: "Zomato", icon: "🔴", color: "#E11D48", light: "#FFF1F2" },
    amazon: { label: "Amazon", icon: "📦", color: "#232F3E", light: "#F3F4F6" },
    default: { label: "Delivery", icon: "📦", color: "#6366F1", light: "#EEF2FF" }
  },
  utility: {
    carpenter: { label: "Carpenter", icon: "🪚", color: "#92400E", light: "#FEF3C7" },
    electrician: { label: "Electrician", icon: "⚡", color: "#F59E0B", light: "#FFFBEB" },
    plumber: { label: "Plumber", icon: "🔧", color: "#0891B2", light: "#ECFEFF" },
    default: { label: "Utility", icon: "🛠️", color: "#10B981", light: "#D1FAE5" },
    pest: { label: 'Pest Control', icon: '🪳', color: '#2D9F20', light: '#E5F1D9' },
  },
  general: {
    default: { label: "Notice", icon: "📢", color: "#64748B", light: "#F8FAFC" }
  },
  visitor: {
    guest: { label: "Guest", icon: "🏠", color: "#4F46E5", light: "#EEF2FF" },
    cab: { label: "Cab/Taxi", icon: "🚕", color: "#F59E0B", light: "#FFFBEB" },
    visitor: { label: "Visitor", icon: "👤", color: "#4F46E5", light: "#EEF2FF" },
    default: { label: "Visitor", icon: "👤", color: "#4F46E5", light: "#EEF2FF" }
  }
};

// --- LIGHTWEIGHT HELPERS ---
const formatTime = (dateString) => {
  if (!dateString) return '--:--';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const formatDuration = (entryTime, exitTime) => {
  if (!entryTime) return '--';
  const start = new Date(entryTime);
  const end = exitTime ? new Date(exitTime) : new Date();
  const diffMins = Math.floor((end - start) / 60000);

  if (diffMins >= 60) return `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
  return diffMins < 1 ? "< 1 min" : `${diffMins} mins`;
};

const getLogTheme = (log) => {
  const category = log.category || (log.riderName ? 'delivery' : log.othertype ? 'utility' : log.displayCategory ? 'visitor' : 'general');
  const type = (log.type || log.company || log.othertype || log.logType || 'default').toLowerCase();
  const themeGroup = NOTIF_THEMES[category] || NOTIF_THEMES.general;
  return themeGroup[type] || themeGroup.default;
};

const Dashboard = () => {
  const dispatch = useDispatch();

  // Data Selectors
  const { residentList = [] } = useSelector(state => state.residents) || {};
  const { staffList = [], staffToday = [] } = useSelector(state => state.staff.data) || {};
  const logsToday = useSelector(state => state.logs.data?.today) || [];

  const totalLog = logsToday.filter(item => item.status === 'IN_PROGRESS')

  // Visitor state data
  const { passCounts = 0, fcmList = [], passList = [] } = useSelector(state => state.visitor.data) || {};

  // Logics for calculation
  const totalVisitorsToday = logsToday.filter(item => item.logType === 'visitor').length;
  
  const insideStaffCount = staffToday.filter(stf => stf.status === 'IN_PROGRESS').length;
  const activeOwnerCount = residentList.filter(item => item.role === 'owner').length;
  
  // New Logic: fcmList items are currently inside via direct approval
  const visitorsInsideNow = fcmList.length;
  // New Logic: passList items represent active/valid pre-approved entries
  const activePasses = passList.length;

  useEffect(() => {
    dispatch(getAllResident());
    dispatch(getAllStaff());
    dispatch(getEntryLogs());
    dispatch(getActiveVisitors());
   
  }, [dispatch]);

  const STATS = [
    { label: 'Total Residents', value: residentList.length, icon: '🏘️', color: COLORS.purple, light: COLORS.purpleLight, sub: `${activeOwnerCount} units occupied` },
    { 
        label: 'Visitors Today', 
        value: totalVisitorsToday, 
        icon: '🚶', 
        color: COLORS.amber, 
        light: COLORS.amberLight, 
        sub: `${visitorsInsideNow} inside` 
    },
    { label: 'Active Staff', value: staffList.length, icon: '👷', color: COLORS.green, light: COLORS.greenLight, sub: `${insideStaffCount} inside` },
    { label: 'Todays Logs', value: logsToday.length, icon: '🪵', color: COLORS.cyan, light: COLORS.cyanLight, sub: `${totalLog.length} inside` },
  ];

  return (
    <div>
      <SectionTitle>Dashboard Overview</SectionTitle>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {STATS.map(s => (
          <Card key={s.label} style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: s.light, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon}</div>
              <span style={{ fontSize: 10, color: s.color, fontWeight: 700, background: s.light, padding: '3px 8px', borderRadius: 20 }}>{s.sub}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#111', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 14 }}>

        {/* Left Side: Recent Entry Logs */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', fontSize: 15, fontWeight: 900, color: '#111', borderBottom: '1px solid #F0F0F5' }}>Recent Entry Logs</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F5' }}>
                {['Time', 'Identity / Purpose', 'Category', 'Unit', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', fontSize: 10, fontWeight: 700, color: '#AAA', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logsToday.map((l, i) => {
                const theme = getLogTheme(l);
                const isStaff = l.category === 'staff' || l.staffId;

                let statusColor = COLORS.green;
                let statusText = 'Allowed';
                if (l.logType === 'visitor' && l.status === 'REJECTED') {
                  statusColor = COLORS.red;
                  statusText = 'Rejected';
                }

                if(l.logType === 'utility'){
                  console.log(l,'met');
                }
             
                return (
                  <tr key={l._id} style={{ borderBottom: i < logsToday.length - 1 ? '1px solid #F6F7FB' : 'none' }}>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: '#666', fontWeight: 600 }}>{formatTime(l.createdAt)}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {(isStaff || l.logType==='utility') && l.photo ? (
                          <img src={l.photo} style={{ width: 34, height: 34, borderRadius: 10, objectFit: 'cover', border: `1.5px solid ${theme.color}40` }} alt="" />
                        ) : (
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: theme.light, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{theme.icon}</div>
                        )}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>{l.name || l.riderName || "Resident"}</div>
                          <div style={{ fontSize: 11, color: '#AAA', fontWeight: 500 }}>{l.company || l.purpose || l.othertype || l.type}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <Badge color={theme.color} bg={theme.light}>{l.logType.charAt(0).toUpperCase() + l.logType.slice(1)}</Badge>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#555', fontWeight: 700 }}>
                      {l.familyId ? l.familyId.split('-').slice(1).join('-') : (l.flat || 'Society')}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: statusColor, fontWeight: 800, fontSize: 12 }}>{statusText}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Right Side: Active Staff Today */}
        <Card style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#111' }}>Active Staff Today</div>
            <div style={{ fontSize: 11, color: COLORS.purple, fontWeight: 800, background: COLORS.purpleLight, padding: '4px 10px', borderRadius: 8 }}>{staffToday.length} Total</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {staffToday.slice(0, 6).map(log => {
              const r = NOTIF_THEMES.staff[log.type?.toLowerCase()] || NOTIF_THEMES.staff.default;
              const isInside = log.status === 'IN_PROGRESS';
              return (
                <div key={log._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ position: 'relative' }}>
                    {log.photo ? (
                      <img src={log.photo} style={{ width: 42, height: 42, borderRadius: 14, objectFit: 'cover', border: `2px solid ${r.color}`, padding: 0, background: '#fff' }} alt="" />
                    ) : (
                      <div style={{ width: 42, height: 42, borderRadius: 14, background: r.light, border: `2px solid ${r.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{r.icon}</div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#111', marginBottom: 2 }}>{log.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: r.color, textTransform: 'uppercase' }}>{r.label}</span>
                      <span style={{ color: '#DDD' }}>•</span>
                      <span style={{ fontSize: 10, color: '#AAA', fontWeight: 600 }}>{log.flat || 'Multiple'}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase', background: isInside ? COLORS.greenLight : '#F0F0F5', color: isInside ? COLORS.green : '#888', marginBottom: 4 }}>{isInside ? 'Inside' : 'Left'}</div>
                    <div style={{ fontSize: 11, color: '#333', fontWeight: 700 }}>
                      {isInside ? `${formatDuration(log.entryTime, null)}` : formatDuration(log.entryTime, log.exitTime)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
