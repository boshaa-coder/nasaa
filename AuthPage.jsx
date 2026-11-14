import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Orbit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DISEASES } from '../data/diseases';
import BackgroundVideo from '../components/BackgroundVideo';

// File lives in public/ -> served from the site root.
const AUTH_VIDEO = '/regestration.mp4';

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', age: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [hasChronic, setHasChronic] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const isLogin = tab === 'login';

  const go = (res) => (res.ok ? nav(res.role === 'admin' ? '/admin' : '/dashboard') : setError(res.error));

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (isLogin) return go(login(form.email, form.password, remember));
    go(register({ ...form, age: Number(form.age), conditions: hasChronic ? conditions : [] }, remember));
  };

  const toggle = (d) => setConditions((c) => (c.includes(d) ? c.filter((x) => x !== d) : [...c, d]));
  const switchTab = (t) => { setTab(t); setError(''); };

  return (
    <div className="auth-page has-bg">
      {/* full-page video, fixed behind everything */}
      <div className="auth-bg">
        <BackgroundVideo src={AUTH_VIDEO} poster="/space.jpg" dim={0.35} />
      </div>

      <div className="auth-visual">
        <div className="auth-visual-text">
          <div className="brand" style={{ border: 'none', padding: 0 }}>
            <div className="brand-logo"><Orbit size={22} /></div>
            <div className="brand-text">NEXUS <span>CARE</span></div>
          </div>
          <p>Astronaut health monitoring and autonomous flight-support platform.</p>
        </div>
      </div>

      <div className="auth-panel">
        <form className="auth-form" onSubmit={submit}>
          <div className="auth-tabs">
            <button type="button" className={isLogin ? 'on' : ''} onClick={() => switchTab('login')}>Login</button>
            <button type="button" className={!isLogin ? 'on' : ''} onClick={() => switchTab('register')}>Registration</button>
          </div>

          <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
          <p className="sub">{isLogin ? 'Welcome back! Please login to your account.' : 'Register to start health monitoring.'}</p>

          {!isLogin && (
            <>
              <div className="field"><label>Full name</label><input required value={form.name} onChange={set('name')} /></div>
              <div className="field"><label>Age</label><input required type="number" min="1" max="120" value={form.age} onChange={set('age')} /></div>
            </>
          )}

          <div className="field"><label>Email</label><input required type="email" value={form.email} onChange={set('email')} /></div>
          <div className="field">
            <label>Password</label>
            <input required type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} />
            <button type="button" className="eye" onClick={() => setShowPw(!showPw)}>{showPw ? <Eye size={18} /> : <EyeOff size={18} />}</button>
          </div>

          {!isLogin && (
            <div className="chronic-box">
              <label className="check">
                <input type="checkbox" checked={hasChronic} onChange={(e) => setHasChronic(e.target.checked)} />
                I have chronic conditions
              </label>
              {hasChronic && (
                <div className="chronic-list">
                  {DISEASES.map((d) => (
                    <label key={d} className="chronic-item">
                      <input type="checkbox" checked={conditions.includes(d)} onChange={() => toggle(d)} />{d}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {isLogin && (
            <div className="row-between">
              <label className="check"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />Remember Me</label>
              <span style={{ color: '#94a3b8' }}>Forget Password?</span>
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}
          <button className="submit-btn">{isLogin ? 'Login' : 'Register'}</button>

          <p className="switch-line">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => switchTab(isLogin ? 'register' : 'login')}>{isLogin ? 'Sign up' : 'Login'}</button>
          </p>
        </form>
      </div>
    </div>
  );
}