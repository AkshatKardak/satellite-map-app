import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { config } from './config/environment.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { authRoutes } from './routes/auth.js';
import { projectsRoutes } from './routes/projects.js';
import { changeDetectionRoutes } from './routes/changeDetection.js';
import { geocodingRoutes } from './routes/geocoding.js';
import { mapServicesRoutes } from './routes/mapServices.js'; // New

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(rateLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/change-detection', changeDetectionRoutes);
app.use('/api/geocoding', geocodingRoutes);
app.use('/api/map-services', mapServicesRoutes); // New

// Health check with service status
app.get('/api/health', async (req, res) => {
  const locationIQConfigured = !!process.env.LOCATIONIQ_API_KEY && 
    process.env.LOCATIONIQ_API_KEY !== 'pk.your_actual_locationiq_access_token_here';
  
  // Basic service availability
  const services = {
    locationIQ: locationIQConfigured,
    nominatim: true,
    photon: true,
    wms: true,
    database: true,
    redis: true
  };

  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    services
  });
});

// Service info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Satellite Map API',
    version: '1.0.0',
    description: 'Free satellite imagery and geocoding services',
    features: [
      'Free WMS satellite imagery',
      'Free geocoding with multiple providers',
      'Change detection analysis',
      'Project management',
      'Multiple free tile services'
    ],
    freeServices: {
      geocoding: ['LocationIQ', 'Nominatim', 'Photon'],
      satellite: ['NRW Germany', 'NASA', 'USGS', 'ESA Sentinel'],
      baseMaps: ['OpenStreetMap', 'Stamen', 'CartoDB', 'OpenTopoMap']
    }
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

export { app };