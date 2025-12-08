import express from 'express';
import { getSales } from '../controllers/salesController.js';

const router = express.Router();

// GET /api/sales
router.get('/', getSales);

export default router;