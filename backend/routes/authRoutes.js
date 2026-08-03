const Router = require('express');
const router = Router();
const authController = require('../controllers/authController');
const ownerController = require('../controllers/ownerController');
const tenantController = require('../controllers/tenantController');
const { verifyToken } = require('../shared/authMiddleware');
const { upload, validateUploadedImages } = require('../shared/upload');

//landing page
//contact us page
//
//user login
router.post('/login', authController.login);
router.post('/signUp', authController.signUp);

router.get('/profile/:id', authController.getUserData);

//owner
// add/list property form
router.post('/addProperty/:id', verifyToken, upload.array("photos"), validateUploadedImages, ownerController.addProperty);

// edit property / delete property
router.get('/editProperty/:id', verifyToken, authController.getProperty);
router.post('/editProperty/:id', verifyToken, ownerController.editProperty);

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
router.post('/addReview', verifyToken, tenantController.addReview);
// all chats
// notifications

//chats
//(all chats)
//chating page with other owner/tenant(where will send message)


module.exports = router;
