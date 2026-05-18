import { COLORS } from "../styles/colors";


// ── Mock Data ─────────────────────────────────────────────────────────────────
export const STATS = [
  { label: 'Total Residents', value: 128, icon: '🏘️', color: COLORS.purple, light: COLORS.purpleLight, sub: '+4 this month' },
  { label: 'Visitors Today',  value: 34,  icon: '🚶', color: COLORS.amber,  light: COLORS.amberLight,  sub: '12 pending' },
  { label: 'Active Staff',    value: 47,  icon: '👷', color: COLORS.green,  light: COLORS.greenLight,  sub: '3 on leave' },
  { label: 'Vehicles Inside', value: 61,  icon: '🚗', color: COLORS.cyan,   light: COLORS.cyanLight,   sub: '8 guests' },
];

export const BLOCKS = [
  { name: 'Block A', flats: ['101','102','103','104','201','202','203','204'], color: COLORS.purple, light: COLORS.purpleLight },
  { name: 'Block B', flats: ['101','102','201','202','203','301','302','303'], color: COLORS.amber,  light: COLORS.amberLight  },
  { name: 'Block C', flats: ['101','102','103','201','202','301'],             color: COLORS.green,  light: COLORS.greenLight  },
];

export const RESIDENTS = [
  { id: 'R001', name: 'Arvind Mehta',   flat: 'A-204', status: 'active',   members: 4, vehicles: 2, phone: '+91 98765 43210' },
  { id: 'R002', name: 'Priya Sharma',   flat: 'B-102', status: 'active',   members: 3, vehicles: 1, phone: '+91 91234 56789' },
  { id: 'R003', name: 'Rahul Gupta',    flat: 'C-301', status: 'inactive', members: 2, vehicles: 1, phone: '+91 87654 32109' },
  { id: 'R004', name: 'Sneha Patel',    flat: 'A-101', status: 'active',   members: 5, vehicles: 2, phone: '+91 76543 21098' },
  { id: 'R005', name: 'Vikram Singh',   flat: 'B-203', status: 'active',   members: 3, vehicles: 1, phone: '+91 99887 76655' },
];

export const STAFF_LIST = [
  { id: 'S001', name: 'Sunita Devi',  role: 'maid',   flat: 'A-204', entry: true,  status: 'active'   },
  { id: 'S002', name: 'Ramesh Kumar', role: 'driver', flat: 'B-102', entry: true,  status: 'active'   },
  { id: 'S003', name: 'Priya Sharma', role: 'cook',   flat: 'C-301', entry: false, status: 'active'   },
  { id: 'S004', name: 'Mohan Singh',  role: 'guard',  flat: 'Society',entry: true, status: 'on-leave' },
  { id: 'S005', name: 'Kavita Rao',   role: 'nanny',  flat: 'A-101', entry: true,  status: 'active'   },
];

export const ROLE_CFG = {
  maid:   { icon: '🧹', color: COLORS.purple, light: COLORS.purpleLight, label: 'Maid'   },
  driver: { icon: '🚗', color: COLORS.amber,  light: COLORS.amberLight,  label: 'Driver' },
  cook:   { icon: '👨‍🍳', color: COLORS.green,  light: COLORS.greenLight,  label: 'Cook'   },
  guard:  { icon: '🛡️', color: COLORS.red,    light: COLORS.redLight,    label: 'Guard'  },
  nanny:  { icon: '🍼', color: COLORS.pink,   light: COLORS.pinkLight,   label: 'Nanny'  },
};

export const LOGS = [
  { time: '09:14 AM', name: 'Sunita Devi',  type: 'Staff',   action: 'Entry', flat: 'A-204', status: 'allowed' },
  { time: '09:32 AM', name: 'Raj Delivery', type: 'Visitor', action: 'Entry', flat: 'B-102', status: 'allowed' },
  { time: '10:01 AM', name: 'Ramesh Kumar', type: 'Staff',   action: 'Entry', flat: 'B-102', status: 'allowed' },
  { time: '10:45 AM', name: 'Unknown',       type: 'Vehicle', action: 'Entry', flat: '—',     status: 'denied'  },
  { time: '11:20 AM', name: 'Priya Sharma',  type: 'Staff',   action: 'Exit',  flat: 'C-301', status: 'allowed' },
  { time: '12:05 PM', name: 'Amazon Courier',type: 'Visitor', action: 'Entry', flat: 'A-101', status: 'allowed' },
];

export const POLICIES = [
  { title: 'Delivery Timing',    desc: 'Allow deliveries between 9 AM – 8 PM only', icon: '📦', enabled: true,  color: COLORS.amber  },
  { title: 'Visitor Entry',      desc: 'Residents must approve before gate opens',   icon: '🚶', enabled: true,  color: COLORS.purple },
  { title: 'Maid Entry Schedule',desc: 'Entry allowed Mon–Sat, 6 AM – 11 AM',       icon: '🧹', enabled: true,  color: COLORS.green  },
  { title: 'Night Restriction',  desc: 'No guests after 11 PM without prior notice', icon: '🌙', enabled: false, color: COLORS.red    },
];