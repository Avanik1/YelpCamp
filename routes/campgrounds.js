const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudinary'); //node automatically looks for index.js file
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

//get request to render a form to collect data to create a new campground
router.get('/new', isLoggedIn ,campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

// router.get('/',catchAsync(campgrounds.index))

//post request to create new campground
//user should not be able to send a request from Postman/Ajax request if not logged in(hence using isLoggedIn)
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground)) 

// router.get('/:id', catchAsync(campgrounds.showCampground))

//get request to serve edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

//put request to submit the edited form data
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

//delete request to delete a campground
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;