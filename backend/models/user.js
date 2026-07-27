const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    //id
    name:{               
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true,
    },
    role:{
        type:String,
        required:true,
        enum:['tenant','owner']
    },
    // notification:{
        
    // }
})

const User = mongoose.model('user', UserSchema);

module.exports = User;