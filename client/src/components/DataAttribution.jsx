import React from 'react';
import { Info, ExternalLink, ShieldCheck, Globe, User } from 'lucide-react';

export function DataAttribution({ sourceUrl }) {
  return (
    <footer className="glass-panel" style={{ padding: '16px 20px', marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={16} color="var(--primary-cyan)" />
          <span style={{ fontWeight: '600', color: 'var(--text-bright)' }}>DATA SOURCE ATTRIBUTION & CREDIT</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)' }}>
          <span>CONFIGURED FEED URL:</span>
          <a
            href={sourceUrl || 'https://celestrak.org'}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--primary-cyan)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            {sourceUrl || 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json'}
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: '1.4' }}>
        <p>
          <strong style={{ color: 'var(--text-cyan)' }}>CelesTrak Attribution:</strong> Satellite orbital data provided courtesy of 
          <a href="https://celestrak.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-cyan)', marginLeft: '4px' }}>
            Dr. T.S. Kelso & CelesTrak.org
          </a> under standard General Perturbations (GP) Orbit Mean-Elements Message (OMM) specifications.
        </p>

        <p style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--accent-amber)' }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Data Clarification & Methodology:</strong> The orbital parameters displayed above are 
            <em> General Perturbations (GP) Keplerian mean element sets</em>, <u>not raw telemetry</u> transmitted live from satellite onboard sensors. Real-time satellite positions and velocity vectors are propagated in real-time on our backend server using standard SGP4 orbital mechanics algorithms via <code>satellite.js</code>.
          </span>
        </p>

        {/* Subtle Developer Copyright & Bootcamp Credit */}
        <div style={{ marginTop: '6px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          © 2026 Tanish Mehta &nbsp;|&nbsp; SATCOM Ground Station — College Drone Bootcamp
        </div>
      </div>
    </footer>
  );
}
