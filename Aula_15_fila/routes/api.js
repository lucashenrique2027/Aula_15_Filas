import { Router } from 'express';
import task from './api/task.js';

export default (function () {

    const router = Router();

    router.use('/',task);

    return router;

})();
