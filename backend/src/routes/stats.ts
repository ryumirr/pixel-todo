import express from 'express';
import { getStats, updateStats } from '../controllers/statsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getStats);
router.post('/update', updateStats);

export default router;