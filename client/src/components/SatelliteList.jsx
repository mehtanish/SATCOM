import React, { useState } from 'react';
import { Search, Navigation, Disc, Activity } from 'lucide-react';

export function SatelliteList({ satellites, selectedSatId, onSelectSat }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = satellites.filter(sat => {
    const name = sat.gpElements?.OBJECT_NAME || '';
    const catId = String(sat.gpElements?.NORAD_CAT_ID || '');
    const term = searchTerm.toLowerCase();
    return name.toLowerCase().includes(term) || catId.includes(term);
  });

  return (
    <div className="glass-panel" style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h2 className="font-header" style={{ fontSize: '0.95rem', color: 'var(--text-bright)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Disc size={16} color="var(--primary-cyan)" />
          ORBITAL DIRECTORY
        </h2>
        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          {filtered.length} OF {satellites.length}
        </span>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Filter by name or NORAD ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(7, 10, 17, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '8px 10px 8px 32px',
            color: '#fff',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            outline: 'none'
          }}
        />
      </div>

      {/* Satellite Scrollable List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            No satellites match filter criteria.
          </div>
        ) : (
          filtered.map((sat) => {
            const gp = sat.gpElements || {};
            const derived = sat.derivedState || {};
            const isSelected = selectedSatId === gp.NORAD_CAT_ID;

            return (
              <div
                key={gp.NORAD_CAT_ID}
                onClick={() => onSelectSat(gp.NORAD_CAT_ID)}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(0, 191, 165, 0.1))' 
                    : 'rgba(13, 19, 33, 0.5)',
                  border: isSelected 
                    ? '1px solid var(--primary-cyan)' 
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: isSelected ? '0 0 12px rgba(0, 229, 255, 0.2)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.88rem', color: isSelected ? 'var(--primary-cyan)' : 'var(--text-bright)' }}>
                    {gp.OBJECT_NAME || 'UNKNOWN OBJ'}
                  </span>
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                    ID #{gp.NORAD_CAT_ID}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  <div>
                    <span>ALT: </span>
                    <span style={{ color: 'var(--text-cyan)' }}>
                      {derived.calculated ? `${derived.altitudeKm} km` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span>SPD: </span>
                    <span style={{ color: 'var(--accent-teal)' }}>
                      {derived.calculated ? `${derived.speedKmS} km/s` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)' }}>
                  <span>INC: {gp.INCLINATION}°</span>
                  <span>REV/DAY: {gp.MEAN_MOTION ? gp.MEAN_MOTION.toFixed(2) : 'N/A'}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
