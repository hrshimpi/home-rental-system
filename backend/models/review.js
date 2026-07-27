const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    property_id:{
        type:mongoose.Types.ObjectId,
        required:true,
    },
    user_id:{
        type:mongoose.Types.ObjectId,
        required:true,
    },
    rating:{               
        type:Number,
        required:true
    },
    comment:{
        type:String,
        required:true,
    },
    postedOn:{
        type:Date,
        required:true,
        default:Date.now()
    }
})

const Review = mongoose.model('review', ReviewSchema);

module.exports = Review;