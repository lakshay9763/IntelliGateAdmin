import { useEffect, useState } from "react";
import { COLORS } from "../../styles/colors";
import { inputStyle } from "../../styles/shared";
import { useDispatch, useSelector } from "react-redux";
import { checkOccupationStatus } from "../../features/resident/residentThunks";

const PHASE_BLOCK_CONFIG = {
  1: ['A', 'B', 'C'],
  2: ['A', 'B', 'C'],
};

const PLOT_OPTIONS = Array.from({ length: 60 }, (_, i) => String(i + 1).padStart(2, '0'));
const FLOOR_OPTIONS = [ '1st', '2nd', '3rd', '4th',];

const SectionGroup = ({ title, icon, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10, borderBottom: '1px solid #F0F0F5' }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: COLORS.purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{icon}</div>
      <span style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>{title}</span>
    </div>
    {children}
  </div>
);

const ChipGroup = ({ label, options, value, onChange, error }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const active = value === String(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(String(opt))}
            style={{
              padding: '7px 16px',
              borderRadius: 10,
              border: `1.5px solid ${active ? COLORS.purple : '#EBEBF5'}`,
              background: active ? COLORS.purple : '#F6F7FB',
              color: active ? '#fff' : '#555',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.15s ease',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
    {error && (
      <div style={{ fontSize: 11, color: COLORS.red, fontWeight: 600, marginTop: 2 }}>⚠ {error}</div>
    )}
  </div>
);

const AddResidentForm = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    phase: '', block: '', plot: '', floor: '',
    photo: null, 
  });
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {error} = useSelector(state=>state.residents)

  const dispatch = useDispatch()
  const set = (k, v) => {
    setForm(f => {
      const next = { ...f, [k]: v };
      // cascade reset
      if (k === 'phase') { next.block = ''; next.plot = ''; next.floor = ''; }
      if (k === 'block') { next.plot = ''; next.floor = ''; }
      if (k === 'plot')  { next.floor = ''; }
      return next;
    });
    setErrors(e => ({ ...e, [k]: '', flat: '' }));
  };

  const derivedFlat = form.phase && form.block && form.plot && form.floor
    ? `P${form.phase}-${form.block}${form.plot}-${form.floor}`
    : null;

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    setForm(f => ({ ...f, photo: file }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.phone.trim())   e.phone   = 'Phone is required';
    if (form.phone && form.phone.length < 10) e.phone = 'Enter a valid phone number';
    if (!form.phase)          e.phase   = 'Select a phase';
    if (!form.block)          e.block   = 'Select a block';
    if (!form.plot)           e.plot    = 'Select a plot';
    if (!form.floor)          e.floor   = 'Select a floor';
    return e;
  };

  useEffect(()=>{
    if(derivedFlat !== null){
      dispatch(checkOccupationStatus({derivedFlat}))
    }
  },[derivedFlat])

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const fileInput = document.querySelector('#photo');
    const file = fileInput?.files[0];

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      flat: derivedFlat,
      phase: form.phase,
      block: form.block,
      plot: form.plot,
      floor: form.floor,
      file: selectedFile,
      password: form.phone.trim(), // Automatically set phone as password
      photoPreview,
    };
    onAdd(payload);
  };

  const fieldErr = (k) => errors[k] ? (
    <div style={{ fontSize: 11, color: COLORS.red, fontWeight: 600, marginTop: 3 }}>⚠ {errors[k]}</div>
  ) : null;

  const formInput = (label, key, opts = {}) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
      <input
        type={opts.type || 'text'}
        value={form[key]}
        onChange={e => set(key, e.target.value)}
        placeholder={opts.placeholder || ''}
        style={{
          ...inputStyle,
          borderColor: errors[key] ? COLORS.red : form[key] ? COLORS.purple + '60' : '#EBEBF5',
          width: '100%',
        }}
      />
      {fieldErr(key)}
    </div>
  );

  const availableBlocks = form.phase ? PHASE_BLOCK_CONFIG[form.phase] ?? [] : [];



  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)',
          zIndex: 100, backdropFilter: 'blur(2px)',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 520,
        background: '#fff', zIndex: 101, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
        animation: 'slideIn 0.25s ease',
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

        {/* Drawer header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #EBEBF5',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#AAA', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Resident Management</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#111', marginTop: 2 }}>Add New Resident</div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #EBEBF5', background: '#F6F7FB', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >✕</button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Photo upload */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Profile Photo</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 80, height: 80, borderRadius: 20, overflow: 'hidden',
                border: `2px ${photoPreview ? 'solid' : 'dashed'} ${photoPreview ? COLORS.purple : '#EBEBF5'}`,
                background: photoPreview ? 'transparent' : '#F6F7FB',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {photoPreview
                  ? <img src={photoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 28 }}>👤</span>
                }
              </div>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
                  background: COLORS.purpleLight, color: COLORS.purple, fontSize: 13, fontWeight: 700,
                  border: `1px solid ${COLORS.purple}30`,
                }}>
                  📷 {photoPreview ? 'Change Photo' : 'Upload Photo'}
                  <input type="file" accept="image/*" id="photo" onChange={handlePhoto} style={{ display: 'none' }} />
                </label>
                <div style={{ fontSize: 11, color: '#AAA', marginTop: 6, fontWeight: 500 }}>Optional · JPG, PNG · Max 5MB</div>
              </div>
            </div>
          </div>

          {/* Section: Personal Info */}
          <SectionGroup title="Personal Information" icon="👤">
            {formInput('Full Name *', 'name', { placeholder: 'e.g. Arvind Mehta' })}
            {formInput('Phone Number *', 'phone', { placeholder: 'e.g. 9876543210', type: 'tel' })}
            {formInput('Email Address', 'email', { placeholder: 'arvind@email.com', type: 'email' })}
          </SectionGroup>

          {/* Section: Flat Assignment */}
          <SectionGroup title="Flat Assignment" icon="🏠">

            <ChipGroup
              label="Phase *"
              options={[1, 2]}
              value={form.phase}
              onChange={v => set('phase', v)}
              error={errors.phase}
            />

            {form.phase && (
              <ChipGroup
                label="Block *"
                options={availableBlocks}
                value={form.block}
                onChange={v => set('block', v)}
                error={errors.block}
              />
            )}

            {form.block && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>Plot No *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {PLOT_OPTIONS.map(opt => {
                    const active = form.plot === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => set('plot', opt)}
                        style={{
                          width: 44, height: 36,
                          borderRadius: 10,
                          border: `1.5px solid ${active ? COLORS.purple : '#EBEBF5'}`,
                          background: active ? COLORS.purple : '#F6F7FB',
                          color: active ? '#fff' : '#555',
                          fontSize: 13, fontWeight: 700,
                          cursor: 'pointer',
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                      >{opt}</button>
                    );
                  })}
                </div>
                {errors.plot && (
                  <div style={{ fontSize: 11, color: COLORS.red, fontWeight: 600 }}>⚠ {errors.plot}</div>
                )}
              </div>
            )}

            {form.plot && (
              <ChipGroup
                label="Floor *"
                options={FLOOR_OPTIONS}
                value={form.floor}
                onChange={v => set('floor', v)}
                error={errors.floor}
              />
            )}

            {derivedFlat && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: COLORS.purpleLight, borderRadius: 12,
                padding: '10px 14px', border: `1px solid ${COLORS.purple}20`,
              }}>
                <span style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>Flat ID:</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.purple, letterSpacing: 0.5 }}>{derivedFlat}</span>
              </div>
            )}

          </SectionGroup>

          <h2>{error}</h2>

          {/* Section: Account */}
          <SectionGroup title="App Account" icon="🔐">
            
            {/* Default Password Info Box */}
            <div style={{ background: '#F6F7FB', borderRadius: 12, padding: '16px', border: '1px solid #EBEBF5' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>Login Credentials</div>
              <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>
                To make onboarding easy, the resident's <strong>Phone Number</strong> will be set as their default password. They can change it later in their app settings.
              </div>
              
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', padding: '10px 14px', borderRadius: 8, border: '1px dashed #CCC' }}>
                <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>Default Password:</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: form.phone ? COLORS.purple : '#AAA', letterSpacing: 1 }}>
                  {form.phone || 'Enter phone number above'}
                </span>
              </div>
            </div>

            {/* Auto-filled note */}
            <div style={{ background: COLORS.purpleLight, borderRadius: 12, padding: '12px 14px', border: `1px solid ${COLORS.purple}20` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: COLORS.purple, marginBottom: 6 }}>Auto-filled by system</div>
              {[
                ['Status', 'Active'],
                ['Since', new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
                  <span style={{ color: '#888', fontWeight: 500 }}>{k}</span>
                  <span style={{ color: COLORS.purple, fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </SectionGroup>
        </div>

        {/* Sticky footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid #EBEBF5',
          display: 'flex', gap: 12, flexShrink: 0, background: '#fff',
        }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #EBEBF5', background: '#fff', fontSize: 14, fontWeight: 700, color: '#555', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
          >Cancel</button>
          <button
            onClick={handleSubmit}
            style={{ flex: 2, padding: '12px', borderRadius: 12, border: 'none', background: COLORS.purple, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', boxShadow: `0 4px 14px ${COLORS.purple}40` }}
          >＋ Add Resident</button>
        </div>
      </div>
    </>
  );
};

export default AddResidentForm;