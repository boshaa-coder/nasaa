import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Send, HeartPulse, Dumbbell, Gamepad2, Stethoscope, FileText,
  User, LogOut, RotateCcw, Orbit, Clock, Siren,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { VitalsProvider } from '../context/VitalsContext';

const COMMAND = [
  ['/admin', 'Overview', LayoutDashboard, true],
  ['/admin/members', 'Crew Members', Users, false],
  ['/admin/messages', 'Send Messages', Send, false],
];

const PERSONAL = [
  ['/dashboard', 'My Dashboard', LayoutDashboard, false],
  ['/health-care', 'Health Care', HeartPulse, false],
  ['/training', 'Training', Dumbbell, false],
  ['/tests', 'Tests & Games', Gamepad2, false],
  ['/dr-ai', 'Dr NOVA', Stethoscope, false],
  ['/reports', 'Reports', FileText, false],
];

function Item({ to, label, Icon, end }) {
  return (
    <li>
      <NavLink to={to} end={end} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <Icon size={18} /><span className="label">{label}</span>
      </NavLink>
    </li>
  );
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  return now;
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { trigger } = useAlert();
  const nav = useNavigate();
  const now = useClock();
  const utc = now.toISOString().slice(11, 16) + ' UTC';
  const initial = user.name?.[0]?.toUpperCase() ?? 'A';

  const resetDemo = () => {
    if (!window.confirm('Delete all users, scores and incidents?')) return;
    localStorage.clear(); sessionStorage.clear(); window.location.href = '/auth';
  };

  return (
    <VitalsProvider>
      <aside className="sidebar has-groups">
        <div>
          <div className="brand">
            <div className="brand-logo"><Orbit size={22} /></div>
            <div className="brand-text">ORBIT <span>ADMIN</span></div>
          </div>
          <ul className="nav-menu">
            <li className="nav-group-label">Command</li>
            {COMMAND.map(([to, label, Icon, end]) => <Item key={to} to={to} label={label} Icon={Icon} end={end} />)}
            <li className="nav-group-label">My Health</li>
            {PERSONAL.map(([to, label, Icon, end]) => <Item key={to} to={to} label={label} Icon={Icon} end={end} />)}
          </ul>
        </div>
        <div className="sidebar-footer">
          <NavLink to="/profile" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <User size={18} /><span className="label">Profile</span>
          </NavLink>
          <button className="nav-item" onClick={resetDemo}>
            <RotateCcw size={18} /><span className="label">Reset Demo</span>
          </button>
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
            <div className="avatar" title={user.name} onClick={() => nav('/profile')}>{initial}</div>
          </div>
        </header>
        <Outlet />
      </main>
    </VitalsProvider>
  );
}