import { Router } from 'express';
import { auth } from '../middleware/auth.js';

const router = Router();

router.use(auth);

// Placeholder routes
router.post('/detect', (req, res) => {
  res.json({ success: true, data: { changePercentage: 0 } });
});

export { router as changeDetectionRoutes };