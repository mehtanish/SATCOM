import { useState, useEffect, useCallback } from 'react';

export function useSatelliteData(pollingIntervalMs = 15000) {
  const [data, setData] = useState({ satellites: [], meta: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(prev => (data.satellites.length === 0 ? true : prev));
      const res = await fetch('/api/satellite');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch satellite data:', err);
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  }, [data.satellites.length]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, pollingIntervalMs);
    return () => clearInterval(interval);
  }, [fetchData, pollingIntervalMs]);

  return {
    satellites: data.satellites || [],
    meta: data.meta || null,
    loading,
    error,
    lastUpdated,
    refresh: fetchData
  };
}
