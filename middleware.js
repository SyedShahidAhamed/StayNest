const Listing=require("../model/listing");
const expressError = require("../utils/expressError");
const { schema,reviewSchema } = require("../schema");
const Review = require("../model/review");


// ✅ Validation middleware
const validateListing = (req, res, next) => {
    let { error } = schema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};

const validateReviews=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new expressError(400,errMsg);
    }
    else{
        next();
    }
}

let isloggedIn=async(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error', 'You must be logged In');
        return res.redirect("/login");
    }
    next();
}


let saveRedirectUrl=async(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

let isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curUser._id)){
        req.flash('error', 'You must be the owner of this listing');
        return res.redirect(`/listings`);
    }
    next();
}

let isAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curUser._id)){
        req.flash('error', 'You must be the owner of this Review');
        return res.redirect(`/listing/${id}`);
    }
    next();
} 

module.exports={validateListing,validateReviews,isloggedIn,saveRedirectUrl,isOwner,isAuthor};