const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    //chatId
    tenantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const Chat = mongoose.model('chat', ChatSchema);

module.exports = Chat;