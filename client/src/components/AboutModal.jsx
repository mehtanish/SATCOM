import React from 'react';
import { X, User, Code, Database, Layers, ShieldAlert, Cpu, Award } from 'lucide-react';

export function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      background: 'rgba(7, 10, 17, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '680px',
        width: '100%',
        padding: '28px',
        border: '1px solid var(--primary-cyan)',
        boxShadow: '0 0 40px rgba(0, 229, 255, 0.25)',
        position: 'relative',
        animation: 'modal-appear 0.2s ease-out'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-muted)',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--primary-cyan)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,191,165,0.2))',
            border: '1px solid var(--primary-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-cyan)'
          }}>
            <Award size={26} />
          </div>
          <div>
            <h2 className="font-header glow-text" style={{ fontSize: '1.4rem', color: '#fff' }}>
              ABOUT PROJECT & DEVELOPER
            </h2>
            <p style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              COLLEGE DRONE BOOTCAMP PROJECT SUBMISSION
            </p>
          </div>
        </div>

        {/* Information Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>
          <InfoCard label="PROJECT" value="SATCOM Ground Station" highlight color="var(--primary-cyan)" icon={Code} />
          <InfoCard label="DEVELOPER" value="Tanish Mehta" highlight color="var(--accent-teal)" icon={User} />
          <InfoCard label="OBJECTIVE" value="Real-time visualization of satellite orbital data using a public CelesTrak GP data feed and SGP4 propagation." colSpan={2} />
          <InfoCard label="DATA SOURCE" value="CelesTrak (celestrak.org)" icon={Database} />
          <InfoCard label="CORE TECHNOLOGY" value="SGP4 Orbital Propagation & Leaflet" icon={Cpu} />
        </div>

        {/* Data Pipeline Section */}
        <div style={{ background: 'rgba(7,10,17,0.7)', padding: '14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
            END-TO-END DATA PIPELINE
          </div>
          <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-cyan)', fontWeight: '600', letterSpacing: '0.5px' }}>
            CelesTrak → Node.js → SGP4 → REST API → React → Leaflet
          </div>
        </div>

        {/* Mandatory SGP4 Methodology Disclaimer */}
        <div style={{ padding: '12px', background: 'rgba(255, 179, 0, 0.1)', border: '1px solid rgba(255, 179, 0, 0.3)', borderRadius: '6px', color: 'var(--accent-amber)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', lineHeight: '1.4' }}>
          <strong>IMPORTANT METHODOLOGY NOTE:</strong> The displayed satellite latitude, longitude, altitude, and velocity values are SGP4-derived mathematical calculations generated from Keplerian mean orbital elements. They are <u>not raw onboard satellite telemetry</u> transmitted directly from satellite radio downlinks.
        </div>

        {/* Modal Footer */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          © 2026 Tanish Mehta | SATCOM Ground Station — College Drone Bootcamp
        </div>
      </div>

      <style>{`
        @keyframes modal-appear {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function InfoCard({ label, value, highlight, color, icon: IconComp, colSpan }) {
  return (
    <div style={{
      gridColumn: colSpan ? `span ${colSpan}` : 'span 1',
      background: 'rgba(7, 10, 17, 0.7)',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        {IconComp && <IconComp size={12} color="var(--primary-cyan)" />}
        <span>{label}</span>
      </div>
      <div style={{ fontSize: '0.92rem', fontWeight: '600', color: highlight ? color : 'var(--text-bright)', marginTop: '4px' }}>
        {value}
      </div>
    </div>
  );
}
