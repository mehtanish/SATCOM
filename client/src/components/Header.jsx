import React, { useState, useEffect } from 'react';
import { Radio, RefreshCw, Clock, Database, Activity, Cpu, Info } from 'lucide-react';

export function Header({ meta, loading, onRefresh, satelliteCount, onOpenAbout }) {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const status = meta?.status || 'OFFLINE';
  const badgeClass = status === 'ONLINE' ? 'badge-online' : status === 'STALE' ? 'badge-degraded' : 'badge-offline';

  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
      {/* Title & Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,191,165,0.2))',
          border: '1px solid var(--primary-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary-cyan)',
          boxShadow: '0 0 15px var(--primary-cyan-glow)'
        }}>
          <Radio size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="font-header glow-text" style={{ fontSize: '1.35rem', fontWeight: '700', letterSpacing: '1px', color: '#fff' }}>
              SATCOM GROUND STATION
            </h1>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>CELESTRAK GP FEED</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            COLLEGE DRONE BOOTCAMP // TANISH MEHTA
          </p>
        </div>
      </div>

      {/* Center Metrics Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', background: 'rgba(7,10,17,0.6)', padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={16} color="var(--primary-cyan)" />
          <div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TRACKED OBJECTS</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-bright)' }}>
              {satelliteCount} SATS
            </div>
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={16} color="var(--accent-teal)" />
          <div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>FEED STATUS</div>
            <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
              <span className={`badge ${badgeClass}`}>
                <span className={`pulse-dot ${status.toLowerCase()}`}></span>
                {status}
              </span>
            </div>
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} color="var(--accent-green)" />
          <div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SGP4 ENGINE</div>
            <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: '600' }}>
              ACTIVE
            </div>
          </div>
        </div>
      </div>

      {/* Right Time, About Modal & Manual Refresh */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', fontSize: '0.7rem', color: 'var(--primary-cyan)' }}>
            <Clock size={12} />
            <span>SYSTEM UTC CLOCK</span>
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: '600', color: 'var(--text-bright)', letterSpacing: '0.5px' }}>
            {utcTime || 'SYNCING...'}
          </div>
        </div>

        <button
          onClick={onOpenAbout}
          style={{
            background: 'rgba(0, 191, 165, 0.12)',
            border: '1px solid rgba(0, 191, 165, 0.35)',
            color: 'var(--accent-teal)',
            padding: '8px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 191, 165, 0.25)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 191, 165, 0.12)'; }}
        >
          <Info size={14} />
          <span>ABOUT PROJECT</span>
        </button>

        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            color: 'var(--primary-cyan)',
            padding: '8px 14px',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 229, 255, 0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)'; }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>{loading ? 'SYNCING...' : 'REFRESH'}</span>
        </button>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </header>
  );
}
