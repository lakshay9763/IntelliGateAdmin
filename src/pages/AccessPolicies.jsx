import { useState } from "react";
import { POLICIES, RESIDENTS } from "../data/mockData";
import AddResidentForm from "../components/forms/AddResidentForm";
import { Badge, Card, SectionTitle, Toggle } from "../components/ui/sharedComponent";
import { COLORS } from "../styles/colors";
import { btnStyle, inputStyle, smallBtn } from "../styles/shared";

const AccessPolicies = () => {
  const [policies, setPolicies] = useState(POLICIES);

  const toggle = (i) => {
    setPolicies(p => p.map((x, j) => j === i ? { ...x, enabled: !x.enabled } : x));
  };

  return (
    <div>
      <SectionTitle>Access Policies</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {policies.map((p, i) => (
          <Card key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 18, border: `1.5px solid ${p.enabled ? p.color + '40' : '#EBEBF5'}` }}>
            <div style={{ width: 48, height: 48, borderRadius: 15, background: p.enabled ? p.color + '20' : '#F6F7FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
              {p.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#111', marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: '#888', fontWeight: 500, lineHeight: 1.5 }}>{p.desc}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
              <Toggle enabled={p.enabled} onChange={() => toggle(i)} color={p.color} />
              <span style={{ fontSize: 10, fontWeight: 700, color: p.enabled ? p.color : '#AAA' }}>
                {p.enabled ? 'ON' : 'OFF'}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccessPolicies