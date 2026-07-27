const User = require("../models/user");
const Review = require("../models/review");

// get all reviews for a perticular property
module.exports.getAllReviewByID = async (req, res) => {
    const property_id = req.params.id;
    try {
        
        const reviews = await Review.find({"property_id":property_id});
        // console.log(reviews);
        res.status(200).send(reviews);

    } catch (error) {
        // console.log("error in get reviews",error.message)
        res.status(400).send(error.message);
    }
}

//get only one users review

// add review
module.exports.addReview = async (req, res) => {
    const { property_id, user_id, rating, comment } = req.body;

    try {
        const user = await User.findById(user_id);
        if(user.role === 'tenant' ){
            
            const review  = await Review.create({
                property_id, user_id,rating,comment
            });
            res.status(201).send({message:"Review saved!",review});

        }else{
            res.status(400).send({message:"Owner cannot add review!"});
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//edit review