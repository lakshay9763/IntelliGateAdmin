import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Card,
  Badge,
  SectionTitle,
} from "../components/ui/sharedComponent";
import { inputStyle, btnStyle, smallBtn } from "../styles/shared";
import { useDispatch, useSelector } from "react-redux";
// Make sure to export deleteDeviceThunk from your thunks file
import { getAllDevices, pairDeviceThunk, toggleDevicePermission, deleteDeviceThunk } from "../features/devices/deviceThunks";

// ── Constants ─────────────────────────────────────────────────────────────────
const DEVICE_TYPES = ["MAIN", "BACKUP", "TEMPORARY"];
const GATES = ["Main Gate", "North Gate", "South Gate", "East Gate"];
const QR_TIMEOUT_SEC = 300;

const COLORS = {
  red: "#EF4444",
  redLight: "#FEF2F2",
  green: "#22C55E",
  greenLight: "#F0FDF4",
  blue: "#3B82F6",
  blueLight: "#EFF6FF",
  gray: "#64748B",
  grayLight: "#F1F5F9"
};

const ANIMATIONS = `@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`;

// ── AddDeviceDrawer (QR Handshake Logic) ────────────────────────────────────
function AddDeviceDrawer({ onClose }) {
  const [form, setForm] = useState({ deviceType: "MAIN", gate: "", pin: "", duration: "24" });
  const [qrVisible, setQrVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QR_TIMEOUT_SEC);

  const { newDevice } = useSelector(state => state.gateDevices.data);
  const dispatch = useDispatch();

  useEffect(() => {
    let timer;
    if (qrVisible && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setQrVisible(false);
    }
    return () => clearInterval(timer);
  }, [qrVisible, timeLeft]);

  useEffect(() => {
    if (newDevice != null) {
      setQrVisible(true);
      setTimeLeft(QR_TIMEOUT_SEC);
    }
  }, [newDevice]);

  const handleGeneratePairing = () => {
    dispatch(pairDeviceThunk(form));
  };

  return (
    <>
      <div onClick={onClose} style={styles.drawerOverlay} />
      <div style={styles.drawerContainer}>
        <style>{ANIMATIONS}</style>
        <div style={styles.drawerHeader}>
          <div>
            <div style={styles.drawerSubTitle}>Hardware Deployment</div>
            <div style={styles.drawerTitle}>Pair New Device</div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.drawerBody}>
          {!qrVisible ? (
            <>
              <div style={styles.section}>
                <label style={styles.fieldLabel}>Gate Location</label>
                <select 
                  style={inputStyle} 
                  value={form.gate} 
                  onChange={(e) => setForm({...form, gate: e.target.value})}
                >
                  <option value="">Select Gate</option>
                  {GATES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div style={styles.section}>
                <label style={styles.fieldLabel}>Device Type</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {DEVICE_TYPES.map(t => (
                    <button 
                      key={t}
                      onClick={() => setForm({...form, deviceType: t})}
                      style={{
                        ...styles.typeBtn,
                        background: form.deviceType === t ? COLORS.red : "#F6F7FB",
                        color: form.deviceType === t ? "#fff" : "#888"
                      }}
                    >{t}</button>
                  ))}
                </div>
              </div>

              <div style={styles.section}>
                <label style={styles.fieldLabel}>Hardware Master PIN</label>
                <input 
                  type="password" 
                  maxLength={6}
                  placeholder="Set 6-digit PIN"
                  style={inputStyle}
                  value={form.pin}
                  onChange={(e) => setForm({...form, pin: e.target.value})}
                />
              </div>

              {form.deviceType === "TEMPORARY" && (
                <div style={styles.infoBoxBlue}>
                  <label style={styles.fieldLabel}>Access Duration</label>
                  <select style={inputStyle} onChange={(e) => setForm({...form, duration: e.target.value})}>
                    <option value="24">24 Hours</option>
                    <option value="48">48 Hours</option>
                    <option value="168">1 Week</option>
                  </select>
                </div>
              )}

              <button 
                onClick={handleGeneratePairing} 
                disabled={!form.pin || !form.gate}
                style={{...styles.primaryBtn, marginTop: 10}}
              >
                Generate Pairing QR
              </button>
            </>
          ) : (
            <div style={styles.qrContainer}>
              <div style={styles.qrBox}>
                <QRCodeSVG value={newDevice?.activationId || ""} size={200} />
              </div>
              <div style={styles.timerText}>
                Expires in: <span style={{ color: COLORS.red }}>{timeLeft}s</span>
              </div>
              <p style={styles.qrInstruction}>
                Open the <b>IntelliGate App</b> on the device and scan this QR to link hardware ID <b>{newDevice?.deviceId}</b>.
              </p>
              <button onClick={() => setQrVisible(false)} style={styles.secondaryBtn}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function GateDevices() {
  const [showAdd, setShowAdd] = useState(false);
  const dispatch = useDispatch();

  const deviceList = useSelector(state => state.gateDevices.data.existing) || [];

  useEffect(() => {
    dispatch(getAllDevices());
  }, [dispatch]);

  const formatDate = (dateStr) => {
    if(!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const togglePermission = (payload) =>{
    dispatch(toggleDevicePermission(payload))
  }

  // ── Handle Delete Action ──
  const handleDeleteDevice = (deviceId) => {
    if (window.confirm(`Are you sure you want to completely remove device ID: ${deviceId}? This action cannot be undone.`)) {
      dispatch(deleteDeviceThunk({deviceId}));
    }
  };

  return (
    <div>
      {showAdd && <AddDeviceDrawer onClose={() => setShowAdd(false)} />}

      <div style={styles.titleRow}>
        <SectionTitle>Gate Device Management</SectionTitle>
        <button style={btnStyle(COLORS.red)} onClick={() => setShowAdd(true)}>＋ Pair Device</button>
      </div>

      <div style={styles.summaryGrid}>
        <Card style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Online Nodes</div>
          <div style={styles.summaryValue}>{deviceList.filter(d => d.isActive).length}</div>
        </Card>
        <Card style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Total Deployed</div>
          <div style={styles.summaryValue}>{deviceList.length}</div>
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              {["Device ID", "Gate Name", "Type", "Created On", "Status", "Actions"].map(h => (
                <th key={h} style={styles.tableHeadCell}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deviceList.map((dev) => (
              <tr key={dev._id} style={{ borderBottom: "1px solid #F6F7FB" }}>
                <td style={styles.idCell}>{dev.deviceId}</td>
                <td style={styles.tableCell}>{dev.gateName}</td>
                <td style={styles.tableCell}>{dev.deviceType}</td>
                <td style={styles.tableCell}>{formatDate(dev.createdAt)}</td>
                <td style={styles.tableCell}>
                   <Badge 
                    color={dev.isActive ? COLORS.green : "#888"} 
                    bg={dev.isActive ? COLORS.greenLight : "#f0f0f0"}
                  >
                  {dev.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td style={styles.tableCell}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {dev.isActive ? (
                      <button 
                        style={smallBtn(COLORS.red, COLORS.redLight)} 
                        onClick={() => togglePermission({type:'revoke', deviceId:dev.deviceId})}
                      >
                        Revoke
                      </button> 
                    ) : (
                      <button 
                        style={smallBtn(COLORS.green, COLORS.greenLight)} 
                        onClick={() => togglePermission({type:'grant', deviceId:dev.deviceId})}
                      >
                        Grant
                      </button>
                    )}
                    {/* Delete Button */}
                    <button 
                      style={smallBtn(COLORS.gray, COLORS.grayLight)} 
                      onClick={() => handleDeleteDevice(dev.deviceId)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  drawerOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100, backdropFilter: "blur(4px)" },
  drawerContainer: { position: "fixed", top: 0, right: 0, bottom: 0, width: 450, background: "#fff", zIndex: 101, display: "flex", flexDirection: "column", animation: "slideIn 0.3s ease" },
  drawerHeader: { padding: "24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" },
  drawerTitle: { fontSize: 20, fontWeight: "800" },
  drawerSubTitle: { fontSize: 11, color: "#aaa", textTransform: "uppercase" },
  drawerBody: { padding: "24px", flex: 1, display: "flex", flexDirection: "column", gap: "20px" },
  section: { display: "flex", flexDirection: "column", gap: "8px" },
  fieldLabel: { fontSize: 11, fontWeight: "700", color: "#888", textTransform: "uppercase" },
  typeBtn: { flex: 1, padding: "12px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "700" },
  qrContainer: { display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20 },
  qrBox: { padding: 15, background: "#fff", border: "1px solid #eee", borderRadius: 16, marginBottom: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  timerText: { fontSize: 16, fontWeight: "800", marginBottom: 10 },
  qrInstruction: { textAlign: "center", fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 20 },
  primaryBtn: { padding: "16px", borderRadius: "12px", border: "none", background: COLORS.red, color: "#fff", fontWeight: "800", cursor: "pointer" },
  secondaryBtn: { padding: "12px", borderRadius: "12px", border: "1px solid #eee", background: "#fff", fontWeight: "700", width: "100%" },
  closeBtn: { background: "none", border: "none", fontSize: 18, cursor: "pointer" },
  titleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  summaryGrid: { display: "flex", gap: 12, marginBottom: 20 },
  summaryCard: { flex: 1, padding: 16 },
  summaryLabel: { fontSize: 11, color: "#888", fontWeight: "700", textTransform: "uppercase" },
  summaryValue: { fontSize: 24, fontWeight: "800" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeaderRow: { background: "#FAFAFA", borderBottom: "1px solid #F0F0F5" },
  tableHeadCell: { padding: "12px 16px", fontSize: 10, color: "#AAA", textAlign: "left", textTransform: "uppercase" },
  tableCell: { padding: "12px 16px", fontSize: 13, fontWeight: "600" },
  idCell: { padding: "12px 16px", fontSize: 12, fontFamily: "monospace", color: "#888" },
  infoBoxBlue: { background: COLORS.blueLight, padding: 16, borderRadius: 12, display: "flex", flexDirection: "column", gap: 8 }
};