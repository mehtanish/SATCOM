const satellite = require('satellite.js');

// Test look angle calculation
const now = new Date();
const gmst = satellite.gstime(now);

// Observer (Ground Station): SF (37.7749° N, 122.4194° W, alt 0.015 km)
const observerGd = {
  latitude: satellite.degreesToRadians(37.7749),
  longitude: satellite.degreesToRadians(-122.4194),
  height: 0.015
};

// Sample ISS GP
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

const satrec = satellite.json2satrec(sampleGp);
const pv = satellite.propagate(satrec, now);
if (pv.position) {
  const positionEcf = satellite.eciToEcf(pv.position, gmst);
  const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);
  
  const azimuthDeg = satellite.radiansToDegrees(lookAngles.azimuth);
  const elevationDeg = satellite.radiansToDegrees(lookAngles.elevation);
  const rangeKm = lookAngles.rangeSat;
  
  console.log("Look Angles Test:");
  console.log(`Azimuth: ${azimuthDeg.toFixed(2)}°`);
  console.log(`Elevation: ${elevationDeg.toFixed(2)}°`);
  console.log(`Slant Range: ${rangeKm.toFixed(2)} km`);
  console.log(`Visibility: ${elevationDeg > 0 ? 'LINE OF SIGHT (VISIBLE)' : 'BELOW HORIZON'}`);
}
