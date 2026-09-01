import React from 'react';
import { WorldMap } from './WorldMap';
import { PositionRadar } from './PositionRadar';
import { GroundStationPanel } from './GroundStationPanel';
import { TelemetryCharts } from './TelemetryCharts';
import { Satellite, Compass, Layers, ShieldCheck, Activity, Cpu, Clock, Zap } from 'lucide-react';

export function SatelliteDetail({ satellite, satellites, onSelectSat }) {
  if (!satellite) {
    return (
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <Satellite size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <div>SELECT A SATELLITE FROM THE DIRECTORY</div>
        </div>
      </div>
    );
  }

  const gp = satellite.gpElements || {};
  const derived = satellite.derivedState || {};
  const vec = derived.velocityVectorKmS || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Top Banner Card */}
      <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--primary-cyan)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 className="font-header glow-text" style={{ fontSize: '1.4rem', color: '#fff' }}>
                {gp.OBJECT_NAME || 'UNKNOWN SATELLITE'}
              </h2>
              <span className="badge badge-cyan">NORAD #{gp.NORAD_CAT_ID}</span>
              <span className="badge badge-online">
                CLASSIFICATION: {gp.CLASSIFICATION_TYPE === 'U' ? 'UNCLASSIFIED' : gp.CLASSIFICATION_TYPE || 'N/A'}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' }}>
              COSPAR INT ID: <span style={{ color: 'var(--text-bright)' }}>{gp.OBJECT_ID || 'N/A'}</span> | 
              EPHEMERIS TYPE: <span style={{ color: 'var(--text-bright)' }}>{gp.EPHEMERIS_TYPE ?? 'N/A'}</span> | 
              ELEMENT SET #: <span style={{ color: 'var(--text-bright)' }}>{gp.ELEMENT_SET_NO ?? 'N/A'}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>EPOCH TIMESTAMP (UTC)</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', fontWeight: '600' }}>
              {gp.EPOCH || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive World Map & Predicted SGP4 Ground Track */}
      <WorldMap
        satellites={satellites || [satellite]}
        selectedSat={satellite}
        onSelectSat={onSelectSat}
      />

      {/* 3. Ground Station Slant Range & Antenna Geometry */}
      <GroundStationPanel satellite={satellite} />

      {/* 4. Ground Track 2D Kinematics Radar */}
      <PositionRadar satellite={satellite} />

      {/* 5. Telemetry & Orbit Sparkline Charts */}
      <TelemetryCharts selectedSat={satellite} />

      {/* 6. CelesTrak GP Orbital Elements Card Grid */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 className="font-header" style={{ fontSize: '0.95rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} color="var(--primary-cyan)" />
            CELESTRAK GENERAL PERTURBATIONS (GP) ORBITAL ELEMENTS
          </h3>
          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            RAW SOURCE DATA (KEPLERIAN MEAN ELEMENTS)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <ElementTile label="OBJECT NAME" value={gp.OBJECT_NAME} desc="Satellite designation" />
          <ElementTile label="NORAD CATALOG ID" value={gp.NORAD_CAT_ID} desc="NORAD space object catalog number" />
          <ElementTile label="EPOCH TIMESTAMP" value={gp.EPOCH} desc="Element set epoch (UTC)" />
          <ElementTile label="INCLINATION (i)" value={`${gp.INCLINATION}°`} desc="Orbital plane tilt relative to equator" />
          <ElementTile label="ECCENTRICITY (e)" value={gp.ECCENTRICITY} desc="Shape of orbit (0 = circular)" />
          <ElementTile label="MEAN MOTION (n)" value={`${gp.MEAN_MOTION} rev/day`} desc="Orbits per 24 hours" />
          <ElementTile label="RA OF ASC NODE (Ω)" value={`${gp.RA_OF_ASC_NODE}°`} desc="Right ascension of ascending node" />
          <ElementTile label="ARG OF PERICENTER (ω)" value={`${gp.ARG_OF_PERICENTER}°`} desc="Angle of perigee from node" />
          <ElementTile label="MEAN ANOMALY (M)" value={`${gp.MEAN_ANOMALY}°`} desc="Position along orbital ellipse" />
          <ElementTile label="B* DRAG TERM" value={gp.BSTAR} desc="Atmospheric drag coefficient" />
          <ElementTile label="REV AT EPOCH" value={gp.REV_AT_EPOCH} desc="Revolution count at epoch" />
        </div>
      </div>

      {/* 7. SGP4 Velocity Vectors Card */}
      {derived.calculated && (
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Zap size={16} color="var(--accent-amber)" />
            <h4 className="font-header" style={{ fontSize: '0.85rem', color: '#fff' }}>
              ECI VELOCITY VECTOR COMPONENTS (SGP4 PROPAGATED)
            </h4>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontFamily: 'var(--font-mono)' }}>
            <div style={{ background: 'rgba(7,10,17,0.7)', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>V_X (X-AXIS SPEED)</div>
              <div style={{ fontSize: '1rem', color: 'var(--primary-cyan)', fontWeight: '600' }}>{vec.vx} km/s</div>
            </div>
            <div style={{ background: 'rgba(7,10,17,0.7)', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>V_Y (Y-AXIS SPEED)</div>
              <div style={{ fontSize: '1rem', color: 'var(--primary-cyan)', fontWeight: '600' }}>{vec.vy} km/s</div>
            </div>
            <div style={{ background: 'rgba(7,10,17,0.7)', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>V_Z (Z-AXIS SPEED)</div>
              <div style={{ fontSize: '1rem', color: 'var(--primary-cyan)', fontWeight: '600' }}>{vec.vz} km/s</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ElementTile({ label, value, desc }) {
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
        <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {label}
        </div>
        <div style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--text-bright)', margin: '4px 0' }}>
          {value !== undefined && value !== null ? String(value) : 'N/A'}
        </div>
      </div>
      <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.4)' }}>
        {desc}
      </div>
    </div>
  );
}
