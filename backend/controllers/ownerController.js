const Property = require('../models/property');


module.exports.addProperty = async (req, res) => {
    const owner_id = req.params.id;
    // roomAmenities/roomType/rules arrive here already parsed into real
    // arrays - the route's validate(addPropertySchema) middleware does
    // the JSON.parse (and validates the result) before this controller
    // ever runs. Re-parsing an already-parsed array here used to throw
    // ("[Wifi].toString()" -> "Wifi" -> not valid JSON).
    const {
        name, desc, rent, address, landmark,
        deposite, propertyType, tenantType,
        roomAmenities, roomType, rules,
    } = req.body;

    // Uploaded files arrive via multer as req.files, not req.body -
    // 'photos' was never a plain form field, so req.body.photos was
    // always undefined here (silently dropping every uploaded photo).
    const photos = (req.files || []).map((file) => `/uploads/${file.filename}`);

    try {
        const property = await Property.create({
            owner_id, name, desc, rent, address, landmark,
            deposite, roomAmenities, propertyType,
            tenantType, roomType, rules, photos
        })
        res.status(201).send({message:"Property Added!", property:property});
    } catch (error) {
        res.status(400).send(error.message);
        console.log(error);
    }
}

module.exports.editProperty = async (req, res) => {
    const p_id = req.params.id;
    try {
        const property = await Property.findById(p_id);
        if(property === null){
            return res.status(400).send({message:"property does not exists!"});
        }
        if(req.user.id !== property.owner_id.toString()){
            return res.status(403).send({message:"You are not allowed to edit this property!"});
        }
        if(req.body.name !== null){
            property.name = req.body.name;
        }
        if(req.body.desc !== null){
            property.desc = req.body.desc;
        }
        if(req.body.address !== null){
            property.address = req.body.address;
        }
        if(req.body.rent !== null){
            property.rent = req.body.rent;
        }
        if(req.body.deposite !== null){
            property.deposite = req.body.deposite;
        }
        if(req.body.facilities !== null){
            property.facilities = req.body.facilities;
        }
        if(req.body.rooms_available !== null){
            property.rooms_available = req.body.rooms_available;
        }
        if(req.body.roomType !== null){
            property.roomType = req.body.roomType;
        }
        if(req.body.bhkType !== null){
            property.bhkType = req.body.bhkType;
        }
        if(req.body.tenant !== null){
            property.tenant = req.body.tenant;
        }
        //photos remaining
        await property.save();
        res.status(200).send({message:"Property edited!"});
    } catch (error) {
        res.status(400).send({message:error.message});
    }
}

module.exports.getOwnersProperties = async (req, res) => {
    const o_id = req.params.id;
    try {
        const properties = await Property.find({"owner_id":o_id});
        if( properties === null ){
            return res.status(400).json({message:"properties does not exists"});
        }
        res.status(200).send(properties);
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}
