require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const satelliteRouter = require('./routes/satellite');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/satellite', satelliteRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'SATCOM Ground Station Backend',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` SATCOM Ground Station Backend Server`);
  console.log(` Running on port: ${PORT}`);
  console.log(` CelesTrak URL: ${process.env.CELESTRAK_API_URL || 'Default stations list'}`);
  console.log(` API Endpoint: http://localhost:${PORT}/api/satellite`);
  console.log(`====================================================`);
});
