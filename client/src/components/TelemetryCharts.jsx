import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, BarChart2, Zap } from 'lucide-react';

export function TelemetryCharts({ selectedSat }) {
  const [historyMap, setHistoryMap] = useState({});

  const catId = selectedSat?.gpElements?.NORAD_CAT_ID;
  const derived = selectedSat?.derivedState;

  // Track historical points for each satellite in memory (capped at 30 points to prevent memory leaks)
  useEffect(() => {
    if (!catId || !derived || !derived.calculated) return;

    const timeLabel = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
    const point = {
      time: timeLabel,
      alt: derived.altitudeKm,
      speed: derived.speedKmS,
      lat: derived.latitude,
      lng: derived.longitude
    };

    setHistoryMap(prev => {
      const existing = prev[catId] || [];
      // Don't append if timestamp matches last point
      if (existing.length > 0 && existing[existing.length - 1].time === timeLabel) {
        return prev;
      }
      const updated = [...existing, point].slice(-30); // keep max 30 points
      return { ...prev, [catId]: updated };
    });
  }, [catId, derived]);

  const history = historyMap[catId] || [];

  if (!selectedSat || !derived?.calculated) {
    return null;
  }

  return (
    <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 className="font-header" style={{ fontSize: '0.9rem', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} />
          REAL-TIME SGP4 TELEMETRY & KINEMATIC TREND CHARTS
        </h3>
        <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          HISTORICAL SAMPLE SLIDING WINDOW ({history.length} SAMPLES)
        </span>
      </div>

      <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', marginTop: '-6px' }}>
        * Note: Charts render SGP4-derived kinematic positions over time. They are derived via SGP4 propagation, not raw hardware telemetry.
      </p>

      {/* Grid of 2 Sparkline Charts: Altitude & Speed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {/* Chart 1: Altitude vs Time */}
        <SingleSparklineChart
          title="ALTITUDE VS TIME (km)"
          dataKey="alt"
          unit="km"
          color="var(--primary-cyan)"
          history={history}
          currentValue={`${derived.altitudeKm} km`}
        />

        {/* Chart 2: Speed vs Time */}
        <SingleSparklineChart
          title="SPEED VS TIME (km/s)"
          dataKey="speed"
          unit="km/s"
          color="var(--accent-teal)"
          history={history}
          currentValue={`${derived.speedKmS} km/s`}
        />
      </div>
    </div>
  );
}

function SingleSparklineChart({ title, dataKey, unit, color, history, currentValue }) {
  if (history.length < 2) {
    return (
      <div style={{ background: 'rgba(7, 10, 17, 0.7)', padding: '14px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{title}</div>
        <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-cyan)', marginTop: '6px' }}>
          COLLECTING TELEMETRY SAMPLES... ({currentValue})
        </div>
      </div>
    );
  }

  const values = history.map(h => h[dataKey]);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const width = 300;
  const height = 70;
  const padding = 6;

  // Build SVG path points
  const points = history.map((h, i) => {
    const x = padding + (i / (history.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((h[dataKey] - minVal) / range) * (height - 2 * padding);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div style={{ background: 'rgba(7, 10, 17, 0.7)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{title}</span>
        <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: '600', color: color }}>{currentValue}</span>
      </div>

      <svg width="100%" height="70" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        {/* Horizontal grid lines */}
        <line x1="0" y1="10" x2={width} y2="10" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
        <line x1="0" y1="35" x2={width} y2="35" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
        <line x1="0" y1="60" x2={width} y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

        {/* Sparkline path */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Latest point indicator */}
        {history.length > 0 && (() => {
          const lastIdx = history.length - 1;
          const lx = padding + (lastIdx / (history.length - 1)) * (width - 2 * padding);
          const ly = height - padding - ((values[lastIdx] - minVal) / range) * (height - 2 * padding);
          return (
            <circle cx={lx} cy={ly} r="4" fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
          );
        })()}
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' }}>
        <span>MIN: {minVal.toFixed(2)}</span>
        <span>MAX: {maxVal.toFixed(2)}</span>
      </div>
    </div>
  );
}
