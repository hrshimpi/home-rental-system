const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    owner_id:{
        type:mongoose.Types.ObjectId,
        required:true,
    },
    name:{               
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    landmark:{
        type:String,
        required:true
    },
    rent:{
        type:Number,
        required:true,
    },
    deposite:{
        type:Number,
        required:true,
    },
    roomAmenities:{
        type:Array,     //3BHK, hotwater 24/7,food
        required:true
    },
    photos:{
        // type:String
        type:Array,
        // required:true
    },
    availableFrom:{
        type:Date,
        required:true,
        default:Date.now()
    },
    propertyType:{
        type:String,
        enum:['House','Hostel/PG'],
        default:'Hostel/PG'
    },
    bhkType:{       //remaining to add
        type:String,
        enum:['1BHK','2BHK','3BHK'],
        dafault:'1BHK'
    },
    tenantType:{
        type:String,
        // enum:['Male','Female','Anyone'],
        default:'Anyone'
    },
    roomType:{
        type:Array,
        // enum:['Single','Double','Three','Four']
    },
    rules:{
        type:Array
    }
    //add addedOnData field    
    //agreement
})

const Property = mongoose.model('property', PropertySchema);

module.exports = Property;

// p_Id, name, description, address (object){
//     city, state, landmark [array], Longitude, latitude },
//     o_id, rental_price, deposit, number_of_bedrooms,
//     images(array),
    

// https://www.nobroker.in/pune/pg