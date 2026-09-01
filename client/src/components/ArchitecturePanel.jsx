import React from 'react';
import { Layers, ArrowRight, Cpu, Server, Database, Activity, Layout, Map, User, Code, Award } from 'lucide-react';

export function ArchitecturePanel() {
  const steps = [
    { label: 'CelesTrak API', desc: 'Live GP JSON Feed', icon: Database, color: 'var(--primary-cyan)' },
    { label: 'Node.js Data Service', desc: 'HTTP Fetcher', icon: Server, color: 'var(--accent-teal)' },
    { label: '5-Min Server Cache', desc: 'Rate-Limit Safe', icon: Cpu, color: 'var(--accent-amber)' },
    { label: 'SGP4 Propagator', desc: 'satellite.js Engine', icon: Activity, color: 'var(--primary-cyan)' },
    { label: 'Express REST API', desc: 'GET /api/satellite', icon: Server, color: 'var(--text-bright)' },
    { label: 'React Dashboard', desc: 'Ground Station UI', icon: Layout, color: 'var(--accent-teal)' },
    { label: 'Leaflet Map', desc: 'Esri Dark Canvas', icon: Map, color: 'var(--primary-cyan)' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 className="font-header" style={{ fontSize: '0.92rem', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} />
          SYSTEM ARCHITECTURE & PROJECT SPECIFICATIONS
        </h3>
        <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
          BOOTCAMP SUBMISSION
        </span>
      </div>

      {/* Developer & Project Specification Card */}
      <div style={{
        background: 'rgba(7, 10, 17, 0.7)',
        padding: '16px',
        borderRadius: '6px',
        border: '1px solid rgba(0, 229, 255, 0.2)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        fontFamily: 'var(--font-mono)'
      }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PROJECT & PURPOSE</div>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginTop: '2px' }}>SATCOM GROUND STATION</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)', fontWeight: '600' }}>College Drone Bootcamp</div>
        </div>

        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>DEVELOPED BY</div>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-teal)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} /> Tanish Mehta
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>DATA INTEGRATION</div>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-bright)', marginTop: '2px' }}>CelesTrak GP Feed</div>
        </div>

        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CORE TECHNOLOGY</div>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-bright)', marginTop: '2px' }}>SGP4 Orbital Propagation</div>
        </div>

        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>WEB STACK</div>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-bright)', marginTop: '2px' }}>React + Node.js + Express</div>
        </div>
      </div>

      {/* Visual Pipeline Horizontal Flow */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        background: 'rgba(7, 10, 17, 0.7)',
        padding: '14px',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {steps.map((step, idx) => {
          const IconComp = step.icon;
          return (
            <React.Fragment key={idx}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '6px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '6px',
                  background: 'rgba(13, 19, 33, 0.9)',
                  border: `1px solid ${step.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px',
                  boxShadow: `0 0 8px ${step.color}33`
                }}>
                  <IconComp size={16} color={step.color} />
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: '600', fontFamily: 'var(--font-mono)', color: 'var(--text-bright)' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {step.desc}
                </div>
              </div>

              {idx < steps.length - 1 && (
                <ArrowRight size={14} color="rgba(0, 229, 255, 0.4)" style={{ flexShrink: 0 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', lineHeight: '1.4' }}>
        <strong>Architecture Overview:</strong> Orbital elements are sourced directly from CelesTrak. 
        Current satellite position, altitude, velocity, and ground station slant geometry are derived using SGP4 propagation locally on our Express server.
      </p>
    </div>
  );
}
