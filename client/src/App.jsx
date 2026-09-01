import React, { useState, useEffect } from 'react';
import { useSatelliteData } from './hooks/useSatelliteData';
import { Header } from './components/Header';
import { SatelliteList } from './components/SatelliteList';
import { SatelliteDetail } from './components/SatelliteDetail';
import { DataProvenancePanel } from './components/DataProvenancePanel';
import { ArchitecturePanel } from './components/ArchitecturePanel';
import { AboutModal } from './components/AboutModal';
import { StatusBar } from './components/StatusBar';
import { DataAttribution } from './components/DataAttribution';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function App() {
  const { satellites, meta, loading, error, lastUpdated, refresh } = useSatelliteData(15000);
  const [selectedSatId, setSelectedSatId] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Auto-select first satellite when data loads
  useEffect(() => {
    if (satellites.length > 0 && !selectedSatId) {
      setSelectedSatId(satellites[0].gpElements?.NORAD_CAT_ID);
    }
  }, [satellites, selectedSatId]);

  const selectedSat = satellites.find(
    s => s.gpElements?.NORAD_CAT_ID === selectedSatId
  ) || satellites[0] || null;

  return (
    <div style={{ minHeight: '100vh', padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Scanline aerospace aesthetic overlay */}
      <div className="scanline-overlay" />

      {/* Header */}
      <Header
        meta={meta}
        loading={loading}
        onRefresh={refresh}
        satelliteCount={satellites.length}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Error state alert if offline and no data */}
      {error && satellites.length === 0 && (
        <div className="glass-panel" style={{ padding: '24px', margin: '20px 0', borderColor: 'var(--accent-red)', background: 'rgba(255, 61, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent-red)' }}>
            <AlertCircle size={24} />
            <div>
              <h3 className="font-header" style={{ fontSize: '1rem' }}>GROUND STATION LINK FAILURE</h3>
              <p style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', marginTop: '4px', color: 'var(--text-main)' }}>
                {error}. Please check if the Node.js backend server is running on port 3001.
              </p>
            </div>
          </div>
          <button
            onClick={refresh}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              background: 'var(--accent-red)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} /> RE-ATTEMPT CONNECTION
          </button>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <main style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Directory List & Data Provenance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ height: '520px' }}>
            <SatelliteList
              satellites={satellites}
              selectedSatId={selectedSatId}
              onSelectSat={setSelectedSatId}
            />
          </div>

          <DataProvenancePanel meta={meta} />
        </div>

        {/* Right Column: Selected Satellite Detail view & System Architecture */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SatelliteDetail
            satellite={selectedSat}
            satellites={satellites}
            onSelectSat={setSelectedSatId}
          />

          <ArchitecturePanel />
        </div>
      </main>

      {/* Status Bar */}
      <StatusBar meta={meta} lastUpdated={lastUpdated} />

      {/* CelesTrak Attribution & Disclaimer Footer */}
      <DataAttribution sourceUrl={meta?.sourceUrl} />

      {/* About Project & Developer Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}

export default App;
