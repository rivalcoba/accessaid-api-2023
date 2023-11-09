import { Router } from 'express';
import * as aiController from './ai.controller';

const aiRouter = new Router();

// GET /api/v1/ai
aiRouter.get('/', aiController.aiRoot);

export default aiRouter;
