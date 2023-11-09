import { Router } from 'express';

import * as homeController from './home.controller';

const router = new Router();

// GET: /
router.get('/', homeController.renderHomePage);

export default router;
