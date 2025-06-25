import { Router } from 'express';
import DoTaskController from '../app/Http/Controllers/DoTaskController.js';
const router = Router();

router.post('/api/task', DoTaskController);

export default router;