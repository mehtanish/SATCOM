import React from 'react';
import { Radio, Navigation, Eye, EyeOff, Compass, MapPin } from 'lucide-react';

export function GroundStationPanel({ satellite }) {
  const derived = satellite?.derivedState || {};
  const geom = derived.groundStationGeometry || {};
  const gp = satellite?.gpElements || {};

  const hasGeom = geom.calculated;

  return (
    <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 className="font-header" style={{ fontSize: '0.92rem', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={18} color="var(--accent-amber)" />
          GROUND STATION COMMAND & SLANT GEOMETRY
        </h3>
        <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
          CONFIGURED LOCATION
        </span>
      </div>

      {/* Ground Station Metadata Banner */}
      <div style={{ background: 'rgba(7, 10, 17, 0.7)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MapPin size={18} color="var(--accent-amber)" />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-bright)', fontFamily: 'var(--font-mono)' }}>
              {geom.groundStationName || 'BOOTCAMP GROUND STATION ALPHA'}
            </div>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              LAT: <span style={{ color: 'var(--text-cyan)' }}>{geom.groundStationLat ?? 'N/A'}°</span> | 
              LNG: <span style={{ color: 'var(--text-cyan)' }}>{geom.groundStationLng ?? 'N/A'}°</span> | 
              ALT: <span style={{ color: 'var(--text-cyan)' }}>{geom.groundStationAltM ?? 'N/A'} m</span>
            </div>
          </div>
        </div>

        {/* Line of Sight Badge */}
        <div>
          {hasGeom ? (
            geom.isVisible ? (
              <span className="badge badge-online" style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={14} /> LINE OF SIGHT (VISIBLE)
              </span>
            ) : (
              <span className="badge badge-degraded" style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <EyeOff size={14} /> BELOW HORIZON
              </span>
            )
          ) : (
            <span className="badge badge-offline">GEOMETRY N/A</span>
          )}
        </div>
      </div>

      {/* Slant Geometry Telemetry Tile Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
        <Tile
          label="SLANT DISTANCE"
          value={hasGeom ? `${geom.slantDistanceKm} km` : 'N/A'}
          desc="Direct distance from Ground Station to Satellite"
        />
        <Tile
          label="ELEVATION ANGLE"
          value={hasGeom ? `${geom.elevationDeg}°` : 'N/A'}
          desc="Angle above local ground horizon (>0° = Visible)"
        />
        <Tile
          label="AZIMUTH BEARING"
          value={hasGeom ? `${geom.azimuthDeg}°` : 'N/A'}
          desc="Compass bearing from Ground Station to Target"
        />
        <Tile
          label="TARGET ALTITUDE"
          value={derived.calculated ? `${derived.altitudeKm} km` : 'N/A'}
          desc="Calculated SGP4 altitude above Earth ellipsoid"
        />
      </div>
    </div>
  );
}

function Tile({ label, value, desc }) {
  return (
    <div style={{
      background: 'rgba(7, 10, 17, 0.7)',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {label}
        </div>
        <div style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--text-bright)', margin: '4px 0' }}>
          {value}
        </div>
      </div>
      <div style={{ fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.4)' }}>
        {desc}
      </div>
    </div>
  );
}
