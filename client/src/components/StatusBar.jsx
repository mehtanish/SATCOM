import React from 'react';
import { Server, Clock, Database, AlertTriangle, ShieldCheck } from 'lucide-react';

export function StatusBar({ meta, lastUpdated }) {
  if (!meta) return null;

  const {
    sourceUrl,
    cached,
    lastFetchTime,
    cacheAgeSeconds,
    status,
    isStale,
    error,
    totalCount
  } = meta;

  return (
    <div className="glass-panel" style={{ padding: '12px 20px', margin: '20px 0', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        {/* Connection & Cache details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Server size={14} color="var(--primary-cyan)" />
            <span>BACKEND STATUS: </span>
            <span style={{ color: status === 'ONLINE' ? 'var(--accent-green)' : 'var(--accent-amber)', fontWeight: '600' }}>
              {status} {cached ? '(CACHED)' : '(FRESH)'}
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="var(--text-muted)" />
            <span>CACHE AGE: </span>
            <span style={{ color: 'var(--text-cyan)' }}>
              {cacheAgeSeconds !== undefined ? `${cacheAgeSeconds}s` : '0s'}
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={14} color="var(--accent-teal)" />
            <span>LAST CELESTRAK SYNC: </span>
            <span style={{ color: 'var(--text-bright)' }}>
              {lastFetchTime ? new Date(lastFetchTime).toLocaleTimeString() : 'N/A'}
            </span>
          </div>
        </div>

        {/* Rate limit compliance note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-teal)' }}>
          <ShieldCheck size={14} />
          <span>RATE LIMIT SAFE (5-MIN BACKEND CACHE ACTIVE)</span>
        </div>
      </div>

      {/* Error / Stale Notice */}
      {error && (
        <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(255,61,0,0.15)', border: '1px solid rgba(255,61,0,0.3)', borderRadius: '4px', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
