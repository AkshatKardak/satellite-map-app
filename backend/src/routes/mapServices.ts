import { Router } from 'express';
import { 
  getAvailableServices, 
  getWMSServices, 
  getTileServices 
} from '../controllers/mapServicesController.js';

const router = Router();

router.get('/available', getAvailableServices);
router.get('/wms', getWMSServices);
router.get('/tiles', getTileServices);

export { router as mapServicesRoutes };