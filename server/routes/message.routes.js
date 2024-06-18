import Router from 'express';
import { sendMessage,getmessageByconversationId,updateMessage,deleteMessage,markAsRead } from '../controllers/message.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';

const router=Router();

router.route('/:conversationId/sendMessage').post(verifyJWT,sendMessage);
router.route('/getmessageByconversationId/:conversationId').get(verifyJWT,getmessageByconversationId);
router.route('/updateMessage/:messageId').put(verifyJWT,updateMessage);
router.route('/deleteMessage/:messageId').delete(verifyJWT,deleteMessage);
router.route('/markAsRead/:messageId').put(verifyJWT,markAsRead);



export default router;