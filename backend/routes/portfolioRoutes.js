import express from 'express';
import {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  viewPortfolioPublic,
} from '../controllers/portfolioController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes – anyone can view a portfolio
router.get('/:id', getPortfolioById);
router.put('/:id/view', viewPortfolioPublic);

// Protected routes – require login
router.route('/').get(protect, getPortfolios).post(protect, createPortfolio);
router.route('/:id').put(protect, updatePortfolio).delete(protect, deletePortfolio);

export default router;
