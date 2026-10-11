const mongoose= require("mongoose");
const Review = require("./review");
const User=require("./user");
const { Schema } = mongoose;

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    review: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Review' 
    }],
    owner:{
        type:Schema.Types.ObjectId, 
        ref: 'User' 
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.review}});
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;