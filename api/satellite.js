const { calculatePositionAndVelocity } = require('../server/utils/propagator');

// In-memory cache across warm Vercel serverless function invocations
let cache = {
  rawSatellites: null,
  data: null,
  fetchedAt: null,
  expiresAt: 0,
  status: 'UNINITIALIZED',
  error: null,
  sourceUrl: null
};

module.exports = async (req, res) => {
  // CORS Headers for Vercel deployment
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const apiUrl = process.env.CELESTRAK_API_URL || 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json';
  const cacheTtlMs = parseInt(process.env.CACHE_TTL_MS || '300000', 10);
  const now = Date.now();

  const gsConfig = {
    name: process.env.GROUND_STATION_NAME || 'BOOTCAMP GROUND STATION ALPHA',
    lat: parseFloat(process.env.GROUND_STATION_LAT || '37.7749'),
    lng: parseFloat(process.env.GROUND_STATION_LNG || '-122.4194'),
    altM: parseFloat(process.env.GROUND_STATION_ALT_M || '15')
  };

  // Serve cached data if valid, recalculating live SGP4 position at request timestamp
  if (cache.rawSatellites && cache.expiresAt > now) {
    const freshPositionData = cache.rawSatellites.map(sat => ({
      gpElements: sat,
      derivedState: calculatePositionAndVelocity(sat, gsConfig)
    }));

    return res.status(200).json({
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
    });
  }

  // Fetch fresh data from CelesTrak
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'SatcomGroundStation/1.0 (College Drone Bootcamp Project)'
      }
    });

    if (!response.ok) {
      throw new Error(`CelesTrak API responded with status ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();

    if (!Array.isArray(rawData)) {
      throw new Error('CelesTrak response is not a valid array');
    }

    cache.rawSatellites = rawData;
    cache.fetchedAt = new Date().toISOString();
    cache.expiresAt = now + cacheTtlMs;
    cache.status = 'ONLINE';
    cache.sourceUrl = apiUrl;

    const satellitesWithDerived = rawData.map(sat => ({
      gpElements: sat,
      derivedState: calculatePositionAndVelocity(sat, gsConfig)
    }));

    return res.status(200).json({
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
    });
  } catch (err) {
    if (cache.rawSatellites) {
      const fallbackData = cache.rawSatellites.map(sat => ({
        gpElements: sat,
        derivedState: calculatePositionAndVelocity(sat, gsConfig)
      }));

      return res.status(200).json({
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
      });
    }

    return res.status(503).json({
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
    });
  }
};
