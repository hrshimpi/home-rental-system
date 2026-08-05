const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Property = require('../models/property')
const shared = require('../shared/shared');

// Precomputed once at module load (not per-request) so a login attempt
// against a nonexistent email still pays the same bcrypt.compare cost
// as one against a real user - otherwise response time alone leaks
// which emails are registered.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync('dummy-password-for-timing-safety', 12);

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ "email":email }).select('+password');

        if (!user) {
            // Run a dummy compare so this branch takes as long as the
            // real one below - keeps response time from revealing
            // whether the email is registered.
            await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
            return res.status(401).send({message:"Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({message:"Invalid email or password"});
        }

        const token = shared.generateToken(user._id, user.role);
        res.status(200).json({jwt:token});
    } catch (error) {
        res.status(404).send(error.message);
    }
}

module.exports.signUp = async (req, res) => {
    const { role,name,email,password,mobile } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        await User.create({
            role, name, email, password:hashedPassword, mobile
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