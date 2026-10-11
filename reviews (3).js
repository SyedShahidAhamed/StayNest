const express=require("express");
const router=express.Router({mergeParams:true}); //{mergeParams:true} -> used for merging the url /listing/:id/reviews and /:reviewId into /listing/:id/reviews/:reviewId
const Review=require("../model/review");
const Listing=require("../model/listing");
const wrapAsync=require("../utils/wrapAsync")
const expressError=require("../utils/expressError")
const {reviewSchema}=require("../schema");
const {validateReviews,isloggedIn,isAuthor} = require("../utils/middleware");

//controller folder
const reviewsController=require("../controllers/reviews");

//review 
router.post("/",isloggedIn,validateReviews,wrapAsync(reviewsController.createReview));

//delete review
router.delete("/:reviewId",isloggedIn,isAuthor,wrapAsync(reviewsController.deleteReviews));

module.exports=router;