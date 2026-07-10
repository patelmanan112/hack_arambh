import { Router } from 'express';
import { askCopilot, getConversationHistory } from '../controllers/copilot.controller.js';

const router = Router();

router.post('/ask', askCopilot);
router.get('/history', getConversationHistory);

export default router;
