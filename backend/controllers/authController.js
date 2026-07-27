const mongoose = require('mongoose');
const User = require('../models/user');
const Property = require('../models/property')
const shared = require('../shared/shared');

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ 
            $and:[  
                { "email":email }, 
                { "password":password }
            ] 
        });
        if(user) {
            const token = shared.generateToken(user._id, user.role);
            res.status(200).json({jwt:token});
        } else {
            res.status(404).send({message:"Wrong credentials"});
            console.log("user not found");
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
}

module.exports.signUp = async (req, res) => {
    const { role,name,email,password,mobile } = req.body;
    try {
        const user = await User.create({
            role, name, email, password, mobile
        });
        res.status(201).send({message:"Signup Successful!"});
    } catch (error) {
        if ( error.code === 11000 ) {
            if(error.keyValue.email){
                error.message = 'This email is already registered, please login!';
            }
        }
        res.status(400).send(error.message);      
    }
}

module.exports.getAllProperties = async (req, res) => {
    
    try {
        const properties = await Property.find();
        if( properties === null ){
            return res.status(400).json({message:"properties does not exists"});
        }
        res.status(200).send(properties);
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}

module.exports.getProperty = async (req, res) => {
    const p_id = req.params.id;
    try {
        const property = await Property.find({"_id":p_id});
        if( property === null ){
            return res.status(400).send({message:"cannot find property"});
        }
        res.status(200).send(property);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports.getUserData = async (req, res) => {
    const u_id = req.params.id;
    try {
        const user = await User.findById(u_id);
        // const user = await User.find({"_id":u_id});
        if( user === null ){
            return res.status(400).send({message:"cannot find user"});
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message);
    }
}