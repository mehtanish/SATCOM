const satellite = require('satellite.js');

/**
 * Splits an array of [lat, lng] points into multiple continuous segments
 * whenever a longitude wrap-around across the International Date Line occurs (|Δlng| > 180°).
 */
function splitTrackSegments(points) {
  if (!points || points.length === 0) return [];
  const segments = [];
  let currentSegment = [points[0]];

  for (let i = 1; i < points.length; i++) {
    const prevLng = points[i - 1][1];
    const currLng = points[i][1];
    if (Math.abs(currLng - prevLng) > 180) {
      segments.push(currentSegment);
      currentSegment = [points[i]];
    } else {
      currentSegment.push(points[i]);
    }
  }
  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }
  return segments;
}

/**
 * Calculates current real-time position, velocity, SGP4 ground track, and Ground Station look angles
 * for a satellite object given its CelesTrak GP orbital elements.
 * 
 * @param {Object} gpElement - Raw CelesTrak GP JSON element
 * @param {Object} [groundStationConfig] - Ground Station coordinates { name, lat, lng, altM }
 * @returns {Object} Derived position, velocity, ground track segments, and slant geometry
 */
function calculatePositionAndVelocity(gpElement, groundStationConfig = null) {
  try {
    const satrec = satellite.json2satrec(gpElement);
    if (!satrec || satrec.error) {
      return {
        error: `SGP4 initialization error: ${satrec ? satrec.error : 'Unknown'}`,
        calculated: false
      };
    }

    const now = new Date();
    const positionAndVelocity = satellite.propagate(satrec, now);

    if (!positionAndVelocity || !positionAndVelocity.position || !positionAndVelocity.velocity) {
      return {
        error: 'SGP4 propagation resulted in invalid coordinates or decayed orbit',
        calculated: false
      };
    }

    const positionEci = positionAndVelocity.position;
    const velocityEci = positionAndVelocity.velocity;

    // Convert ECI to Geodetic (Lat, Lng, Altitude)
    const gmst = satellite.gstime(now);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);

    const latitudeDeg = satellite.degreesLat(positionGd.latitude);
    const longitudeDeg = satellite.degreesLong(positionGd.longitude);
    const altitudeKm = positionGd.height;

    // Calculate velocity magnitude (km/s)
    const vx = velocityEci.x;
    const vy = velocityEci.y;
    const vz = velocityEci.z;
    const speedKmS = Math.sqrt(vx * vx + vy * vy + vz * vz);

    // Compute SGP4 predicted ground track over 1 full orbit (-T/2 to +T/2)
    const meanMotion = gpElement.MEAN_MOTION || 15.5;
    const periodMinutes = 1440 / meanMotion;
    const halfPeriod = periodMinutes / 2;
    const stepMinutes = 1;
    const rawTrackPoints = [];

    for (let t = -halfPeriod; t <= halfPeriod; t += stepMinutes) {
      const stepTime = new Date(now.getTime() + t * 60 * 1000);
      const pv = satellite.propagate(satrec, stepTime);
      if (pv && pv.position) {
        const gmstStep = satellite.gstime(stepTime);
        const gd = satellite.eciToGeodetic(pv.position, gmstStep);
        const lat = satellite.degreesLat(gd.latitude);
        const lng = satellite.degreesLong(gd.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          rawTrackPoints.push([Number(lat.toFixed(4)), Number(lng.toFixed(4))]);
        }
      }
    }

    const groundTrackSegments = splitTrackSegments(rawTrackPoints);

    // Compute Ground Station Slant Geometry & Look Angles if groundStationConfig is provided
    let groundStationGeometry = null;
    if (groundStationConfig && typeof groundStationConfig.lat === 'number' && typeof groundStationConfig.lng === 'number') {
      try {
        const observerGd = {
          latitude: satellite.degreesToRadians(groundStationConfig.lat),
          longitude: satellite.degreesToRadians(groundStationConfig.lng),
          height: (groundStationConfig.altM || 0) / 1000 // convert meters to km
        };

        const positionEcf = satellite.eciToEcf(positionEci, gmst);
        const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);

        const azimuthDeg = satellite.radiansToDegrees(lookAngles.azimuth);
        const elevationDeg = satellite.radiansToDegrees(lookAngles.elevation);
        const slantRangeKm = lookAngles.rangeSat;

        groundStationGeometry = {
          calculated: true,
          groundStationName: groundStationConfig.name || 'GROUND STATION ALPHA',
          groundStationLat: groundStationConfig.lat,
          groundStationLng: groundStationConfig.lng,
          groundStationAltM: groundStationConfig.altM || 0,
          slantDistanceKm: Number(slantRangeKm.toFixed(2)),
          elevationDeg: Number(elevationDeg.toFixed(2)),
          azimuthDeg: Number(azimuthDeg.toFixed(2)),
          isVisible: elevationDeg > 0
        };
      } catch (err) {
        groundStationGeometry = {
          calculated: false,
          error: `Ground station geometry error: ${err.message}`
        };
      }
    }

    return {
      calculated: true,
      timestamp: now.toISOString(),
      method: "SGP4 Propagation (satellite.js)",
      latitude: Number(latitudeDeg.toFixed(4)),
      longitude: Number(longitudeDeg.toFixed(4)),
      altitudeKm: Number(altitudeKm.toFixed(2)),
      speedKmS: Number(speedKmS.toFixed(3)),
      velocityVectorKmS: {
        vx: Number(vx.toFixed(3)),
        vy: Number(vy.toFixed(3)),
        vz: Number(vz.toFixed(3))
      },
      groundTrackSegments,
      groundStationGeometry
    };
  } catch (err) {
    return {
      error: `Propagation calculation error: ${err.message}`,
      calculated: false
    };
  }
}

module.exports = {
  calculatePositionAndVelocity
};
