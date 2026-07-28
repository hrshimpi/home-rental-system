const Router = require('express');
const router = Router();
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../shared/authMiddleware');

//send msg from one user to another

//load/get all chat messages

router.post('/chat-with-owner', verifyToken, chatController.createNewChat);

router.post('/msg', verifyToken, chatController.sendMsg);

router.get('/get-chat-list/:role/:userId', verifyToken, chatController.getChatListbyUserId);

router.get('/get-chat-by-id/:userId/:chatId', verifyToken, chatController.getChatById);

module.exports = router;