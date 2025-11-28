import { Router } from 'express';
import { auth } from '../middleware/auth.js';

const router = Router();

router.use(auth);

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});

export { router as projectsRoutes };