import { Router } from 'express';
import userRouter from './user/user.route';

const apiV1router = new Router();

// /api/v1/users
apiV1router.use('/users', userRouter);

export default apiV1router;
