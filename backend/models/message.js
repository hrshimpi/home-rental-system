const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat'
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    text:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
})

const Message = mongoose.model('message', MessageSchema);

module.exports = Message;