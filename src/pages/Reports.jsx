import { Badge, Card, SectionTitle } from "../components/ui/sharedComponent";
import { LOGS } from "../data/mockData";
import { COLORS } from "../styles/colors";
import { smallBtn } from "../styles/shared";


const Reports = () => (
  <div>
    <SectionTitle>Reports</SectionTitle>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
      {[
        { title: 'Entry Logs',        icon: '📋', count: '1,248', sub: 'This month',  color: COLORS.purple, light: COLORS.purpleLight },
        { title: 'Visitor History',   icon: '🚶', count: '342',   sub: 'This month',  color: COLORS.amber,  light: COLORS.amberLight  },
        { title: 'Staff Attendance',  icon: '✅', count: '94%',   sub: 'Avg this month', color: COLORS.green, light: COLORS.greenLight },
        { title: 'Denied Entries',    icon: '🚫', count: '17',    sub: 'This month',  color: COLORS.red,    light: COLORS.redLight    },
      ].map(r => (
        <Card key={r.title} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: r.light, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{r.icon}</div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: r.color, lineHeight: 1 }}>{r.count}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#111', marginTop: 2 }}>{r.title}</div>
            <div style={{ fontSize: 11, color: '#AAA', fontWeight: 500 }}>{r.sub}</div>
          </div>
          <button style={{ ...smallBtn(r.color, r.light), marginLeft: 'auto' }}>Export</button>
        </Card>
      ))}
    </div>

    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F0F5', fontSize: 14, fontWeight: 800, color: '#111' }}>
        Full Entry Log
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F5' }}>
            {['Time','Name','Type','Action','Flat','Status'].map(h => (
              <th key={h} style={{ padding: '10px 16px', fontSize: 10, fontWeight: 700, color: '#AAA', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {LOGS.map((l, i) => (
            <tr key={i} style={{ borderBottom: i < LOGS.length - 1 ? '1px solid #F6F7FB' : 'none' }}>
              <td style={{ padding: '11px 16px', fontSize: 12, color: '#888', fontFamily: 'monospace' }}>{l.time}</td>
              <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 700, color: '#111' }}>{l.name}</td>
              <td style={{ padding: '11px 16px' }}><Badge color="#555" bg="#F0F0F5">{l.type}</Badge></td>
              <td style={{ padding: '11px 16px', fontSize: 12, color: '#555', fontWeight: 600 }}>{l.action}</td>
              <td style={{ padding: '11px 16px', fontSize: 12, color: '#888' }}>{l.flat}</td>
              <td style={{ padding: '11px 16px' }}>
                <Badge color={l.status === 'allowed' ? COLORS.green : COLORS.red} bg={l.status === 'allowed' ? COLORS.greenLight : COLORS.redLight}>
                  {l.status === 'allowed' ? '✓ Allowed' : '✕ Denied'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

export default Reports
