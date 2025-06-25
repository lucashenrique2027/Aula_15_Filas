import { Router } from 'express';
import DoTaskController from '../../app/Http/Controllers/DoTaskController.js';

const router = Router();

router.post('/task', DoTaskController);

export default router;
