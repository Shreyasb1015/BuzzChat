import Router from 'express';
import { createConversation,getConversationsByUser,updateConversion,deleteConversation } from '../controllers/conversation.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/createConversation').post(verifyJWT,createConversation);
router.route('/getConversationsByUser').get(verifyJWT,getConversationsByUser);
router.route('/updateConversation/:conversationId').put(verifyJWT,updateConversion);
router.route('/deleteConversation/:conversationId').delete(verifyJWT,deleteConversation);

export default router;