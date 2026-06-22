import express from 'express';
import {
  createStrategy,
  getAllStrategies,
  getStrategyById,
  updateStrategy,
  deleteStrategy,
  getStrategyByUserId
} from '../controllers/Strategy.Saved';

const router = express.Router();

router
  .route('/')
  .get(getAllStrategies)
  .post(createStrategy);

router.route('/:userid')
  .get(getStrategyByUserId);

router
  .route('/:id')
  .get(getStrategyById)
  .put(updateStrategy)
  .delete(deleteStrategy);

export default router;
