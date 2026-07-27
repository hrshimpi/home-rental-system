const Router = require('express');
const router = Router();
const authController = require('../controllers/authController');
const ownerController = require('../controllers/ownerController');
const tenantController = require('../controllers/tenantController');

const multer = require('multer');

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }else{
        cb(new Error('Invalid file type'), false);
    }
}

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,'../uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({
    storage:storage,
    fileFiletr:fileFilter,
})


//landing page
//contact us page
//
//user login
router.post('/login', authController.login);
router.post('/signUp', authController.signUp);

router.get('/profile/:id', authController.getUserData);

//owner
// add/list property form
router.post('/addProperty/:id', upload.array("photos") ,ownerController.addProperty);

// edit property / delete property
router.get('/editProperty/:id',authController.getProperty);
router.post('/editProperty/:id',ownerController.editProperty);

// list of his propety(table or card)
router.get('/myProperties/:id', ownerController.getOwnersProperties);

// single property detail page (will contain reviews also)
router.get('/propertyDetails/:id', authController.getProperty);


//tenant
// display all properties (filter option above)
router.get('/allProperties', authController.getAllProperties);
// single property detail page (add review option)

//reviews
router.get('/reviews/:id', tenantController.getAllReviewByID);
router.post('/addReview', tenantController.addReview);
// all chats
// notifications

//chats
//(all chats)
//chating page with other owner/tenant(where will send message)


module.exports = router;
