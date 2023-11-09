import { Router } from 'express';
import userRouter from './user/user.route';
import aiRouter from './ai/ai.route';

const apiV1router = new Router();

// * /api/v1/users
apiV1router.use('/users', userRouter);

// * /api/v1/ai
apiV1router.use('/ai', aiRouter);

export default apiV1router;
