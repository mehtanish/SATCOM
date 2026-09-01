import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Globe, Compass, Target, LocateFixed } from 'lucide-react';

export function WorldMap({ satellites, selectedSat, onSelectSat }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const polylineGroupRef = useRef(null);
  const prevSelectedSatIdRef = useRef(null);

  // 1. Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 1.5,
      maxZoom: 10,
      zoomControl: false,
      attributionControl: false
    });

    // Open Esri World Dark Gray Base tile layer (Public open access, no API key required)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Layer group for orbit ground tracks
    const polylineGroup = L.layerGroup().addTo(map);
    polylineGroupRef.current = polylineGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Auto-recenter map with smooth flyTo animation whenever selected satellite changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedSat) return;

    const currentSatId = selectedSat.gpElements?.NORAD_CAT_ID;
    const derived = selectedSat.derivedState;

    if (derived?.calculated && derived.latitude !== undefined && derived.longitude !== undefined) {
      if (prevSelectedSatIdRef.current !== currentSatId) {
        prevSelectedSatIdRef.current = currentSatId;
        map.flyTo([derived.latitude, derived.longitude], 4, {
          duration: 1.2,
          easeLinearity: 0.25
        });
      }
    }
  }, [selectedSat]);

  // 3. Update satellite markers and predicted orbit ground track whenever satellites or selectedSat changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const selectedId = selectedSat?.gpElements?.NORAD_CAT_ID;

    // Clear existing orbit polyline paths
    if (polylineGroupRef.current) {
      polylineGroupRef.current.clearLayers();
    }

    // Create / Update markers for all satellites
    satellites.forEach((sat) => {
      const gp = sat.gpElements || {};
      const derived = sat.derivedState || {};
      const catId = gp.NORAD_CAT_ID;

      if (!derived.calculated || derived.latitude === undefined || derived.longitude === undefined) {
        return;
      }

      const isSelected = catId === selectedId;
      const latLng = [derived.latitude, derived.longitude];

      // Create custom SVG DIV icon
      const iconHtml = `
        <div style="
          position: relative;
          width: ${isSelected ? '24px' : '12px'};
          height: ${isSelected ? '24px' : '12px'};
          margin-left: ${isSelected ? '-12px' : '-6px'};
          margin-top: ${isSelected ? '-12px' : '-6px'};
        ">
          ${isSelected ? `
            <div style="
              position: absolute; top: -6px; left: -6px; right: -6px; bottom: -6px;
              border: 1px solid #00e5ff;
              border-radius: 50%;
              animation: map-pulse 2s infinite;
              pointer-events: none;
            "></div>
          ` : ''}
          <div style="
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: ${isSelected ? '#00e5ff' : 'rgba(0, 191, 165, 0.7)'};
            border: ${isSelected ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.4)'};
            box-shadow: 0 0 ${isSelected ? '12px #00e5ff' : '4px rgba(0, 191, 165, 0.5)'};
          "></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-sat-icon',
        iconSize: [isSelected ? 24 : 12, isSelected ? 24 : 12]
      });

      if (!markersRef.current[catId]) {
        // Create new marker
        const marker = L.marker(latLng, { icon: customIcon }).addTo(map);
        marker.on('click', () => onSelectSat(catId));
        markersRef.current[catId] = marker;
      } else {
        // Update existing marker position & icon
        const marker = markersRef.current[catId];
        marker.setLatLng(latLng);
        marker.setIcon(customIcon);
        if (isSelected) {
          marker.zindex = 1000;
        }
      }

      // Bind tooltip
      markersRef.current[catId].bindTooltip(
        `<strong style="color: ${isSelected ? '#00e5ff' : '#fff'}">${gp.OBJECT_NAME}</strong><br/>ALT: ${derived.altitudeKm} km | SPD: ${derived.speedKmS} km/s`,
        { direction: 'top', offset: [0, -10], opacity: 0.9, className: 'sat-map-tooltip' }
      );
    });

    // Remove obsolete markers
    Object.keys(markersRef.current).forEach((catIdStr) => {
      const catId = Number(catIdStr);
      const exists = satellites.some(s => s.gpElements?.NORAD_CAT_ID === catId);
      if (!exists) {
        map.removeLayer(markersRef.current[catId]);
        delete markersRef.current[catId];
      }
    });

    // Draw SGP4 predicted ground track polylines for the selected satellite
    if (selectedSat && selectedSat.derivedState?.groundTrackSegments) {
      const segments = selectedSat.derivedState.groundTrackSegments;

      segments.forEach((segment) => {
        if (segment && segment.length > 1) {
          // Glow background line
          L.polyline(segment, {
            color: '#00e5ff',
            weight: 4,
            opacity: 0.25,
            smoothFactor: 1
          }).addTo(polylineGroupRef.current);

          // Primary ground track line
          L.polyline(segment, {
            color: '#00e5ff',
            weight: 2,
            opacity: 0.85,
            dashArray: '6, 4',
            smoothFactor: 1
          }).addTo(polylineGroupRef.current);
        }
      });
    }
  }, [satellites, selectedSat, onSelectSat]);

  // Recenter map on selected satellite manually
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    const derived = selectedSat?.derivedState;
    if (map && derived?.latitude !== undefined && derived?.longitude !== undefined) {
      map.flyTo([derived.latitude, derived.longitude], 4, { duration: 1.2 });
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 className="font-header" style={{ fontSize: '0.92rem', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={18} />
          INTERACTIVE SATELLITE WORLD TRACKER & ORBITAL PATH
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleRecenter}
            style={{
              background: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              color: 'var(--primary-cyan)',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LocateFixed size={12} /> RE-CENTER TARGET
          </button>
          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            LEAFLET // ESRI DARK CANVAS MAP
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ position: 'relative', width: '100%', height: '360px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: '#090d16' }} />

        {/* Legend Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 1000,
          background: 'rgba(7, 10, 17, 0.85)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(0, 229, 255, 0.2)',
          borderRadius: '4px',
          padding: '8px 12px',
          fontSize: '0.7rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-main)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00e5ff', display: 'inline-block', boxShadow: '0 0 6px #00e5ff' }}></span>
            <span>SELECTED SATELLITE ({selectedSat?.gpElements?.OBJECT_NAME || 'NONE'})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '16px', height: '2px', background: '#00e5ff', borderStyle: 'dashed', display: 'inline-block' }}></span>
            <span>SGP4 PREDICTED ORBIT GROUND TRACK</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(0, 191, 165, 0.8)', display: 'inline-block' }}></span>
            <span>OTHER TRACKED SATELLITES</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes map-pulse {
          0% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .sat-map-tooltip {
          background: rgba(7, 10, 17, 0.9) !important;
          border: 1px solid rgba(0, 229, 255, 0.4) !important;
          color: #fff !important;
          font-family: var(--font-mono) !important;
          font-size: 0.72rem !important;
          border-radius: 4px !important;
          padding: 4px 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
        }
        .leaflet-container {
          font-family: var(--font-mono) !important;
        }
      `}</style>
    </div>
  );
}
