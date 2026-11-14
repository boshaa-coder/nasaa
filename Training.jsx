import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Dumbbell, Bike, PersonStanding, Crosshair, Droplets, ScanEye, Wind, Activity,
  Hand, Bot, ShieldCheck, FlaskConical, ChevronDown, ArrowRight,
} from 'lucide-react';
import { TRAINING_GROUPS } from '../../data/training';
import { RISK_BY_ID } from '../../data/risks';

const ICONS = {
  dumbbell: Dumbbell, bike: Bike, spine: PersonStanding, gaze: Crosshair, fluid: Droplets, scan: ScanEye,
  wind: Wind, activity: Activity, hand: Hand, bot: Bot, shield: ShieldCheck, flask: FlaskConical,
};

export default function Training() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [open, setOpen] = useState(params.get('open')); // /training?open=ared opens a module directly

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Zero-Gravity Training Protocol</h1>
        <p>Select any module to see how it is performed and which spaceflight risk it helps prevent</p>
      </div>

      {TRAINING_GROUPS.map((g) => (
        <div key={g.id}>
          <h2 className="training-group-title">{g.title}</h2>
          <div className="training-list">
            {g.items.map((m) => {
              const Icon = ICONS[m.icon] ?? Dumbbell;
              const isOpen = open === m.id;
              const risk = RISK_BY_ID[m.riskId];
              return (
                <div key={m.id} className={`glass-card training-bar${isOpen ? ' open' : ''}`} onClick={() => setOpen(isOpen ? null : m.id)}>
                  <div className="training-bar-header">
                    <div className="training-bar-left">
                      <div className="training-icon-box"><Icon size={24} /></div>
                      <div className="training-bar-title"><h3>{m.title}</h3></div>
                    </div>
                    <div className="training-bar-right">
                      {risk && <span className="duration-tag">{risk.short}</span>}
                      <ChevronDown className="chevron" size={20} />
                    </div>
                  </div>

                  <div className="training-details" onClick={(e) => e.stopPropagation()}>
                    <div className="training-info">
                      <div className="info-block"><h4>How to perform</h4><p>{m.how}</p></div>
                      <div className="info-block"><h4>Objective</h4><p>{m.objective}</p></div>
                      {risk && (
                        <button className="btn-primary risk-link" onClick={() => nav(`/risks?risk=${risk.id}`)}>
                          View related risk: {risk.title}<ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
