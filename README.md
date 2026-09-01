# 🛰️ SATCOM Ground Station

### Real-Time Satellite Orbital Data Visualization

A full-stack satellite ground-station dashboard developed for the **College Drone Bootcamp**.

The application consumes publicly available satellite orbital data from **CelesTrak**, processes the data using **SGP4 orbital propagation**, and visualizes the resulting satellite state through an interactive web dashboard.

---

## 🚀 Features

- 🛰️ Live satellite orbital-data integration
- 🌍 Interactive world map
- 📍 SGP4-derived real-time satellite position
- 🛤️ Satellite ground-track visualization
- 🚀 Satellite altitude and velocity
- 📡 Data-feed health monitoring
- 🔄 Automatic data synchronization
- 🔎 Satellite search and selection
- 📊 Orbital and derived-state information
- 📈 Altitude and velocity visualization
- 🛰️ Ground-station geometry
- ⚡ Responsive aerospace-style dashboard
- 🔐 Server-side API integration
- ❌ No fabricated or mocked satellite data

---

## 🧠 How It Works

The system follows this pipeline:

```text
             CELESTRAK
          Public GP Feed
                 │
                 │ HTTP GET
                 ▼
        ┌─────────────────┐
        │  Node.js Server │
        │                 │
        │ Data Fetching   │
        │ & Caching       │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ SGP4 Propagator │
        │                 │
        │ Position        │
        │ Velocity        │
        │ Altitude        │
        └────────┬────────┘
                 │
                 ▼
          Express REST API
             /api/satellite
                 │
                 ▼
        ┌─────────────────┐
        │  React Frontend │
        └────────┬────────┘
                 │
        ┌────────┴─────────┐
        ▼                  ▼
     World Map         Dashboard
     + Track          + Telemetry
