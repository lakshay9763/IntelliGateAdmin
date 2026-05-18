
export const inputStyle = {
  flex: 1, padding: '10px 14px', borderRadius: 12, border: '1.5px solid #0606cd',
  fontSize: 13, fontWeight: 600, color: '#111', outline: 'none',
  background: '#FbFbFb', fontFamily: 'DM Sans, sans-serif',
};

export const btnStyle = (color) => ({
  padding: '10px 18px', borderRadius: 12, border: 'none', cursor: 'pointer',
  background: color, color: '#fff', fontSize: 13, fontWeight: 800,
  fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap',
  boxShadow: `0 4px 12px ${color}40`,
});

export const smallBtn = (color, bg) => ({
  padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
  background: bg, color, fontSize: 11, fontWeight: 800, fontFamily: 'DM Sans, sans-serif',
  whiteSpace: 'nowrap',
});