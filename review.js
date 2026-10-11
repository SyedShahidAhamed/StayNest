const mongoose= require("mongoose");
const { Schema } = mongoose;
const User=require("./user");

const reviewSchema=new mongoose.Schema({
    rating:{
        type:Number
    },
    comments:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }
});

// const Review =mongoose.model("Review",reviewSchema);  this is used commonly but in case of OverwriteModelError not used

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);//this is used because of changing code from listing to review files

module.exports = Review;