import React from 'react';
import { Crosshair, MapPin, Compass, Gauge } from 'lucide-react';

export function PositionRadar({ satellite }) {
  const gp = satellite?.gpElements || {};
  const derived = satellite?.derivedState || {};

  const lat = derived.latitude ?? 0;
  const lng = derived.longitude ?? 0;
  const alt = derived.altitudeKm ?? 0;
  const speed = derived.speedKmS ?? 0;

  // Convert lat (-90 to +90) and lng (-180 to +180) to percentage coordinates for radar canvas
  const xPct = ((lng + 180) / 360) * 100;
  const yPct = ((90 - lat) / 180) * 100;

  return (
    <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 className="font-header" style={{ fontSize: '0.88rem', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crosshair size={16} />
          REAL-TIME GROUND TRACK & KINEMATICS (SGP4 DERIVED)
        </h3>
        <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', background: 'rgba(0,191,165,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(0,191,165,0.3)' }}>
          LAT/LON/ALT CALCULATED
        </span>
      </div>

      {/* 2D Equirectangular Radar Map Canvas */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '210px',
        borderRadius: '6px',
        background: 'radial-gradient(ellipse at center, rgba(13, 27, 42, 0.9) 0%, rgba(7, 10, 17, 0.95) 100%)',
        border: '1px solid rgba(0, 229, 255, 0.2)',
        overflow: 'hidden'
      }}>
        {/* World Grid Lines */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 229, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 229, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '16.66% 25%'
        }} />

        {/* Equator & Prime Meridian highlight lines */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0, 229, 255, 0.25)', borderStyle: 'dashed' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(0, 229, 255, 0.25)', borderStyle: 'dashed' }} />

        {/* Coordinates Labels */}
        <span style={{ position: 'absolute', top: '4px', left: '6px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>90°N</span>
        <span style={{ position: 'absolute', bottom: '4px', left: '6px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>90°S</span>
        <span style={{ position: 'absolute', bottom: '4px', left: '6px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>180°W</span>
        <span style={{ position: 'absolute', bottom: '4px', right: '6px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>180°E</span>

        {/* Target Reticle Pin */}
        {derived.calculated && (
          <div style={{
            position: 'absolute',
            left: `${xPct}%`,
            top: `${yPct}%`,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            {/* Pulsing ring */}
            <div style={{
              position: 'absolute',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: '1px solid var(--primary-cyan)',
              animation: 'pulse-ring 2s infinite'
            }} />

            {/* Target Dot */}
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--primary-cyan)',
              boxShadow: '0 0 10px var(--primary-cyan)'
            }} />

            {/* Label tag */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '12px',
              whiteSpace: 'nowrap',
              background: 'rgba(7, 10, 17, 0.9)',
              border: '1px solid var(--primary-cyan)',
              borderRadius: '3px',
              padding: '1px 5px',
              fontSize: '0.65rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--primary-cyan)'
            }}>
              {gp.OBJECT_NAME || 'OBJ'}
            </div>
          </div>
        )}
      </div>

      {/* Kinematics Telemetry Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        <div style={{ background: 'rgba(7,10,17,0.6)', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LATITUDE</div>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', fontFamily: 'var(--font-mono)', color: 'var(--text-bright)' }}>
            {derived.calculated ? `${lat}°` : 'N/A'}
          </div>
        </div>

        <div style={{ background: 'rgba(7,10,17,0.6)', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LONGITUDE</div>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', fontFamily: 'var(--font-mono)', color: 'var(--text-bright)' }}>
            {derived.calculated ? `${lng}°` : 'N/A'}
          </div>
        </div>

        <div style={{ background: 'rgba(7,10,17,0.6)', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ALTITUDE</div>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', fontFamily: 'var(--font-mono)', color: 'var(--primary-cyan)' }}>
            {derived.calculated ? `${alt} km` : 'N/A'}
          </div>
        </div>

        <div style={{ background: 'rgba(7,10,17,0.6)', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SPEED (V)</div>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)' }}>
            {derived.calculated ? `${speed} km/s` : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}
