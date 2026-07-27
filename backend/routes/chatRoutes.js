const Router = require('express');
const router = Router();
const chatController = require('../controllers/chatController');

//send msg from one user to another

//load/get all chat messages

router.post('/chat-with-owner', chatController.createNewChat);

router.post('/msg', chatController.sendMsg);

router.get('/get-chat-list/:role/:userId', chatController.getChatListbyUserId);

router.get('/get-chat-by-id/:userId/:chatId', chatController.getChatById);

module.exports = router;