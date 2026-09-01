const { calculatePositionAndVelocity } = require('../utils/propagator');

// In-memory cache
let cache = {
  rawSatellites: null,
  data: null,
  fetchedAt: null,
  expiresAt: 0,
  status: 'UNINITIALIZED',
  error: null,
  sourceUrl: null
};

/**
 * Fetches satellite GP data from CelesTrak with server-side caching.
 * Respects rate limits by maintaining an in-memory cache TTL (default: 5 mins).
 */
async function getSatelliteData() {
  const apiUrl = process.env.CELESTRAK_API_URL || 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json';
  const cacheTtlMs = parseInt(process.env.CACHE_TTL_MS || '300000', 10);
  const now = Date.now();

  const gsConfig = {
    name: process.env.GROUND_STATION_NAME || 'BOOTCAMP GROUND STATION ALPHA',
    lat: parseFloat(process.env.GROUND_STATION_LAT || '37.7749'),
    lng: parseFloat(process.env.GROUND_STATION_LNG || '-122.4194'),
    altM: parseFloat(process.env.GROUND_STATION_ALT_M || '15')
  };

  // Return cached response if valid, recalculating live SGP4 position at request timestamp
  if (cache.rawSatellites && cache.expiresAt > now) {
    const freshPositionData = cache.rawSatellites.map(sat => {
      return {
        gpElements: sat,
        derivedState: calculatePositionAndVelocity(sat, gsConfig)
      };
    });

    return {
      satellites: freshPositionData,
      meta: {
        sourceUrl: apiUrl,
        attribution: "Data provided by CelesTrak (celestrak.org) under GP Orbital Elements standard.",
        cached: true,
        lastFetchTime: cache.fetchedAt,
        lastCalculationTime: new Date().toISOString(),
        cacheExpiresAt: new Date(cache.expiresAt).toISOString(),
        cacheAgeSeconds: Math.floor((now - new Date(cache.fetchedAt).getTime()) / 1000),
        status: cache.status,
        totalCount: freshPositionData.length,
        groundStation: gsConfig
      }
    };
  }

  // Fetch fresh data from CelesTrak
  try {
    console.log(`[CelesTrak Service] Fetching fresh data from: ${apiUrl}`);
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'SatcomGroundStation/1.0 (College Drone Bootcamp Project)'
      },
      timeout: 15000
    });

    if (!response.ok) {
      throw new Error(`CelesTrak API responded with HTTP status ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();

    if (!Array.isArray(rawData)) {
      throw new Error('CelesTrak API response format was not a valid array');
    }

    // Update cache
    cache.rawSatellites = rawData;
    cache.fetchedAt = new Date().toISOString();
    cache.expiresAt = now + cacheTtlMs;
    cache.status = 'ONLINE';
    cache.error = null;
    cache.sourceUrl = apiUrl;

    const satellitesWithDerived = rawData.map(sat => ({
      gpElements: sat,
      derivedState: calculatePositionAndVelocity(sat, gsConfig)
    }));

    cache.data = satellitesWithDerived;

    return {
      satellites: satellitesWithDerived,
      meta: {
        sourceUrl: apiUrl,
        attribution: "Data provided by CelesTrak (celestrak.org) under GP Orbital Elements standard.",
        cached: false,
        lastFetchTime: cache.fetchedAt,
        lastCalculationTime: new Date().toISOString(),
        cacheExpiresAt: new Date(cache.expiresAt).toISOString(),
        cacheAgeSeconds: 0,
        status: 'ONLINE',
        totalCount: satellitesWithDerived.length,
        groundStation: gsConfig
      }
    };
  } catch (err) {
    console.error('[CelesTrak Service Error]:', err.message);
    
    // Serve stale cached data if available
    if (cache.rawSatellites) {
      const fallbackData = cache.rawSatellites.map(sat => ({
        gpElements: sat,
        derivedState: calculatePositionAndVelocity(sat, gsConfig)
      }));

      return {
        satellites: fallbackData,
        meta: {
          sourceUrl: apiUrl,
          attribution: "Data provided by CelesTrak (celestrak.org) under GP Orbital Elements standard.",
          cached: true,
          isStale: true,
          lastFetchTime: cache.fetchedAt,
          lastCalculationTime: new Date().toISOString(),
          status: 'STALE',
          error: `DATA FEED UNAVAILABLE — DISPLAYING LAST VALID DATA (${err.message})`,
          totalCount: fallbackData.length,
          groundStation: gsConfig
        }
      };
    }

    // Offline state
    return {
      satellites: [],
      meta: {
        sourceUrl: apiUrl,
        attribution: "Data provided by CelesTrak (celestrak.org)",
        cached: false,
        lastFetchTime: null,
        lastCalculationTime: new Date().toISOString(),
        status: 'OFFLINE',
        error: `Failed to fetch orbital data from CelesTrak: ${err.message}`,
        totalCount: 0,
        groundStation: gsConfig
      }
    };
  }
}

module.exports = {
  getSatelliteData
};
