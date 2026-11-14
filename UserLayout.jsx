import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, HeartPulse, Dumbbell, Gamepad2, Stethoscope, Mail, FileText,
  User, LogOut, Bell, Clock, Orbit, Siren,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { VitalsProvider } from '../context/VitalsContext';
import useStorage from '../hooks/useStorage';

const LINKS = [
  ['/dashboard', 'Dashboard', LayoutDashboard],
  ['/health-care', 'Health Care', HeartPulse],
  ['/training', 'Training', Dumbbell],
  ['/tests', 'Tests & Games', Gamepad2],
  ['/dr-ai', 'Dr NOVA', Stethoscope],
  ['/messages', 'Messages', Mail],
  ['/reports', 'Reports', FileText],
];

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  return now;
}

export default function UserLayout() {
  const { user, logout } = useAuth();
  const { trigger } = useAlert();
  const nav = useNavigate();
  const now = useClock();
  const utc = now.toISOString().slice(11, 16) + ' UTC';
  const initial = user.name?.[0]?.toUpperCase() ?? 'A';

  // unread admin messages = messages addressed to me (or to all) minus the count already read
  const [inbox] = useStorage('inbox', []);
  const [read] = useStorage(`read:${user.email}`, 0);
  const unread = Math.max(0, inbox.filter((m) => m.to === 'all' || m.to === user.email).length - read);

  return (
    <VitalsProvider>
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-logo"><Orbit size={22} /></div>
            <div className="brand-text">ORBIT <span>CARE</span></div>
          </div>
          <ul className="nav-menu">
            {LINKS.map(([to, label, Icon]) => (
              <li key={to}>
                <NavLink to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                  <Icon size={18} /><span className="label">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="sidebar-footer">
          <NavLink to="/profile" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <User size={18} /><span className="label">Profile</span>
          </NavLink>
          <button className="nav-item logout" onClick={() => { logout(); nav('/auth'); }}>
            <LogOut size={18} /><span className="label">Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-wrapper">
        <header className="topbar">
          <div className="mission-clock">
            <div className="clock-icon"><Clock size={20} /></div>
            <div className="clock-info">
              <h3>{utc}</h3>
              <p>Mission Time: T+12:48 · Low Earth Orbit</p>
            </div>
          </div>
          <div className="user-controls">
            <button className="alert-btn" onClick={trigger}><Siren size={15} />ALERT</button>
            <div className="notif-btn" onClick={() => nav('/messages')}>
              <Bell size={18} />{unread > 0 && <span className="notif-badge">{unread}</span>}
            </div>
            <div className="avatar" title={user.name} onClick={() => nav('/profile')}>{initial}</div>
          </div>
        </header>
        <Outlet />
      </main>
    </VitalsProvider>
  );
}