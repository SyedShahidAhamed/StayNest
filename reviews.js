const Review=require("../model/review");
const Listing=require("../model/listing");

module.exports.createReview = async(req,res)=>{
    let {id}=req.params;
    const data = req.body;
    //review data save
    let review1=new Review(data);
    review1.author=req.user._id;
    await review1.save();
    //listing data save
    let listing=await Listing.findById(id);
    listing.review.push(review1);
    await listing.save();
    // later you’ll save this review to MongoDB
    req.flash('success','New Review Created!');
    res.redirect(`/listing/${id}`);
}

module.exports.deleteReviews = async(req,res)=>{
    let {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review Deleted!');
    res.redirect(`/listing/${id}`);
}