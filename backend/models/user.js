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
        select:false,
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

// Second layer of defense: even if a query explicitly re-selects the
// password (e.g. login's .select('+password')), it never leaks through
// serialization (res.json / JSON.stringify).
UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;