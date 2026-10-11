const mongoose= require("mongoose");
const data=require("./data");
const Listing=require("../model/listing");
const mongoUrl="mongodb://localhost:27017/Airbnb";
async function main(){
   await mongoose.connect(mongoUrl);
}
main()
    .then(()=>console.log("Connected to MongoDb"))
    .catch(err=>console.log(err));

const newListing=async()=>{
    await Listing.deleteMany({});
    const updatedData=data.map((obj)=>({...obj,owner:"68d4d23ff5354b5a394ea8ef"}));
    await Listing.insertMany(updatedData);
}
newListing().then(res=>console.log(res));