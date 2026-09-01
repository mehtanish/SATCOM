import React from 'react';
import { Database, ShieldCheck, Info, CheckCircle2, Clock, Server } from 'lucide-react';

export function DataProvenancePanel({ meta }) {
  if (!meta) return null;

  const {
    sourceUrl,
    attribution,
    cached,
    lastFetchTime,
    lastCalculationTime,
    cacheAgeSeconds,
    status,
    totalCount
  } = meta;

  const statusBadgeClass = status === 'ONLINE' ? 'badge-online' : status === 'STALE' ? 'badge-degraded' : 'badge-offline';

  return (
    <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 className="font-header" style={{ fontSize: '0.92rem', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={18} />
          DATA PROVENANCE & SYSTEM STATUS
        </h3>
        <span className={`badge ${statusBadgeClass}`}>
          <span className={`pulse-dot ${(status || 'offline').toLowerCase()}`}></span>
          BACKEND: {status}
        </span>
      </div>

      {/* Provenance Table Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontFamily: 'var(--font-mono)' }}>
        <ProvTile label="DATA SOURCE" value="CelesTrak (celestrak.org)" highlight color="var(--primary-cyan)" />
        <ProvTile label="FEED SPECIFICATION" value="General Perturbations (GP)" />
        <ProvTile label="FEED GROUP" value="Stations (Space Stations)" />
        <ProvTile label="DATA FORMAT" value="OMM / JSON" />
        <ProvTile label="ORBIT PROPAGATOR" value="SGP4 (satellite.js)" highlight color="var(--accent-teal)" />
        <ProvTile label="TRACKED OBJECTS" value={`${totalCount} Active Objects`} />
        <ProvTile label="LAST CELESTRAK FETCH" value={lastFetchTime ? new Date(lastFetchTime).toLocaleTimeString() : 'N/A'} />
        <ProvTile label="LAST POSITION CALC" value={lastCalculationTime ? new Date(lastCalculationTime).toLocaleTimeString() : 'N/A'} />
        <ProvTile label="CACHE AGE / TTL" value={`${cacheAgeSeconds ?? 0}s / 300s (5m)`} />
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
        <p style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--text-cyan)' }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Data Lineage Clarification:</strong> Orbital elements are ingested directly from CelesTrak. 
            All real-time coordinates (Latitude, Longitude, Altitude, Velocity, Slant Range) are 
            <u> SGP4-derived mathematical calculations</u> propagated locally on the backend. They are 
            <strong> NOT raw hardware telemetry</strong> transmitted from satellite radio downlinks.
          </span>
        </p>
      </div>
    </div>
  );
}

function ProvTile({ label, value, highlight, color }) {
  return (
    <div style={{
      background: 'rgba(7, 10, 17, 0.7)',
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: highlight ? color : 'var(--text-bright)', marginTop: '3px' }}>
        {value}
      </div>
    </div>
  );
}
