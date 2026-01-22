import express from 'express';
import { getCurrentFrame, fillNextCell, getGallery } from '../controllers/frameController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/current', getCurrentFrame);
router.post('/fill-cell', fillNextCell);
router.get('/gallery', getGallery);

export default router;