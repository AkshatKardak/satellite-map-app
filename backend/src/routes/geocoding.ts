import { Router } from 'express';
import { searchLocation, getGeocodingUsage } from '../controllers/geocodingController.js';

const router = Router();

router.get('/search', searchLocation);
router.get('/usage', getGeocodingUsage); // New endpoint to check usage

export { router as geocodingRoutes };