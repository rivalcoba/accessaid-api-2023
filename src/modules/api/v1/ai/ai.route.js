import { Router } from 'express';
import * as aiController from './ai.controller';

const aiRouter = new Router();

// POST /api/v1/ai
aiRouter.post('/', aiController.aiRoot);

// POST /api/v1/ai/test
aiRouter.post('/test', aiController.aiTest);

// POST /api/v1/ai/train
aiRouter.post('/train', aiController.train);

// POST /api/v1/ai/getAnswer
aiRouter.post('/get-answer', aiController.getAnswer);

export default aiRouter;
