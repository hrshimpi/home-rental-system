const Chat = require('../models/chat');
const Message = require('../models/message');
const mongoose = require('mongoose');
module.exports.createNewChat = async (req, res) => {
    const { tenantId, ownerId } = req.body;
    console.log("working1")
    try {
        var pchat = await Chat.findOne({
            tenantId: tenantId,
            ownerId: ownerId
          });
        if(pchat) {
            return res.status(200).send({message:"Chat already exists"});
        }
        const newChat = await Chat.create({
            tenantId,
            ownerId
        })
        console.log("working2:", newChat);
        res.status(201).send({message:"Chat created!"})

    } catch (error) {
        console.log(error);
        res.status(400).send({message:error.message});
    }
}

module.exports.sendMsg = async (req, res) => {
    const { senderId, chatId, msg } = req.body;
    try {
        const message = await Message.create({
            chatId:chatId, sender:senderId, text:msg
        })
        console.log(message);
        res.status(201).send({message:"Msg sent!"});
    } catch (error) {
        res.status(400).send({message:error.message});
    }
}

module.exports.getChatListbyUserId = async (req, res) => {
    const userId = req.params.userId;
    const role = req.params.role;
    console.log(role,userId);
    try {
        var chatDetailList;
        if(role === 'tenant'){
            chatDetailList = await Chat.aggregate([
                {
                  '$match': {
                    'tenantId': new mongoose.Types.ObjectId(userId) 
                  }
                }, {
                  '$lookup': {
                    'from': 'users', 
                    'localField': 'ownerId', 
                    'foreignField': '_id', 
                    'as': 'RecieverData'
                  }
                }
              ])
            console.log(chatDetailList)
        }else if(role == 'owner') {
            chatDetailList = await Chat.aggregate([
                {
                  '$match': {
                    'ownerId': new mongoose.Types.ObjectId(userId)
                  }
                }, {
                  '$lookup': {
                    'from': 'users', 
                    'localField': 'tenantId', 
                    'foreignField': '_id', 
                    'as': 'RecieverData'
                  }
                }
              ])
        }else {
            return res.status(400).send({message:"Role undefined!"});
        }
        res.status(200).send(chatDetailList);
            
    } catch (error) {
      res.status(400).send({message:error.message});
    }
}

module.exports.getChatById = async (req, res) => {
  const userId = req.params.userId;
  const chatId = req.params.chatId;
  try {
    const chats = await Message.find({"chatId":chatId});
    res.status(200).send(chats);
  } catch (error) {
    res.status(400).send({message:error.message});
  }
}

