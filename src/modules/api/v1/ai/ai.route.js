import { Router } from 'express';
import * as aiController from './ai.controller';

const aiRouter = new Router();

// POST /api/v1/ai
aiRouter.post('/', aiController.aiRoot);

// POST /api/v1/ai/test
aiRouter.post('/test', aiController.aiTest);

export default aiRouter;
