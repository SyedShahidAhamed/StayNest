const express = require("express");
const router = express.Router();
const Listing = require("../model/listing");
const Review = require("../model/review");
const wrapAsync = require("../utils/wrapAsync");
const {validateListing,isloggedIn,isOwner} = require("../utils/middleware");
const expressError = require("../utils/expressError");
const { schema } = require("../schema");

//multer for local storing
const multer  = require('multer');
const {storage} = require("../cloudconfig");
const upload = multer({storage});

//controller folder
const listingController=require("../controllers/listing");

// ✅ Home page - show all listings
router.get("/", wrapAsync(listingController.index));

// ✅ New listing form
router.get("/new",isloggedIn,listingController.new);

// ✅ Create new listing
router.post("/",isloggedIn, validateListing, upload.single('image'), wrapAsync(listingController.newListing));

// ✅ Individual listing page
router.get("/:id", wrapAsync(listingController.individualListing));

// ✅ Edit form
router.get("/:id/edit", isloggedIn, isOwner, wrapAsync(listingController.editForm));

// ✅ Update listing
router.put("/:id", isloggedIn, isOwner, validateListing, upload.single('image'), wrapAsync(listingController.updateListing));

// ✅ Delete listing
router.delete("/:id", isloggedIn,isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
