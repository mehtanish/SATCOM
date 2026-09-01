const satellite = require('satellite.js');

const sampleGp = {
  OBJECT_NAME: "ISS (ZARYA)",
  OBJECT_ID: "1998-067A",
  EPOCH: "2026-09-01T11:57:51.489504",
  MEAN_MOTION: 15.48958602,
  ECCENTRICITY: 0.00050553,
  INCLINATION: 51.6312,
  RA_OF_ASC_NODE: 282.3953,
  ARG_OF_PERICENTER: 96.474,
  MEAN_ANOMALY: 263.6825,
  EPHEMERIS_TYPE: 0,
  CLASSIFICATION_TYPE: "U",
  NORAD_CAT_ID: 25544,
  ELEMENT_SET_NO: 999,
  REV_AT_EPOCH: 58358,
  BSTAR: 7.9223149e-5,
  MEAN_MOTION_DOT: 3.91e-5,
  MEAN_MOTION_DDOT: 0
};

try {
  const satrec = satellite.json2satrec(sampleGp);
  console.log("satrec created successfully:", !!satrec);
  const now = new Date();
  const positionAndVelocity = satellite.propagate(satrec, now);
  console.log("Position & Velocity:", positionAndVelocity);
  if (positionAndVelocity.position && positionAndVelocity.velocity) {
    const gmst = satellite.gstime(now);
    const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
    const longitude = satellite.degreesLong(positionGd.longitude);
    const latitude = satellite.degreesLat(positionGd.latitude);
    const height = positionGd.height; // altitude in km
    
    const v = positionAndVelocity.velocity;
    const speedKmS = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    
    console.log(`Lat: ${latitude.toFixed(4)}°, Lon: ${longitude.toFixed(4)}°, Alt: ${height.toFixed(2)} km, Speed: ${speedKmS.toFixed(3)} km/s`);
  }
} catch (err) {
  console.error("Error with json2satrec:", err.message);
}
