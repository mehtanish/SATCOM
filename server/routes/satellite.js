const express = require('express');
const router = express.Router();
const { getSatelliteData } = require('../services/celestrak');

/**
 * GET /api/satellite
 * Returns list of satellites with CelesTrak GP orbital elements and SGP4-derived position/velocity.
 */
router.get('/', async (req, res) => {
  try {
    const result = await getSatelliteData();
    if (result.meta.status === 'OFFLINE' && result.satellites.length === 0) {
      return res.status(503).json(result);
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      satellites: [],
      meta: {
        status: 'ERROR',
        error: `Internal server error: ${err.message}`
      }
    });
  }
});

module.exports = router;
