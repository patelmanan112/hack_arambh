import { Router } from 'express';
import { askCopilot } from '../controllers/copilot.controller.js';

const router = Router();

router.post('/ask', askCopilot);

export default router;
