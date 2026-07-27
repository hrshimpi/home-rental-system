const Property = require('../models/property');


module.exports.addProperty = async (req, res) => {
    console.log("photos array: ", req.body.photos);
    const owner_id = req.params.id;
    const { 
        name, desc, rent, address, landmark, 
        deposite, propertyType, 
        tenantType, photos } = req.body;

    const roomAmenities = JSON.parse(req.body.roomAmenities);
    const roomType = JSON.parse(req.body.roomType);
    const rules = JSON.parse(req.body.rules);
    try {
        console.log(req.body.roomType);
        const property = await Property.create({
            owner_id, name, desc, rent, address, landmark,
            deposite, roomAmenities:roomAmenities, propertyType, 
            tenantType, roomType:roomType, rules:rules, photos
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
        const property = await TextTrackList.findById(p_id);
        if(property === null){
            return res.status(400).send({message:"property does not exists!"});
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
