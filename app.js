require('dotenv').config()

const express=require("express");
const app=express();
const router=express.Router();
const mongoose= require("mongoose");
const Listing=require("./model/listing");
const path=require("path");
var methodOverride = require('method-override');
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync")
const expressError=require("./utils/expressError")
const {schema,reviewSchema}=require("./schema");
const Review=require("./model/review");
//routes
const listingsRoutes=require("./routes/listing");
const reviewsRoutes=require("./routes/reviews");
const usersRoutes=require("./routes/user");

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
//passport
const passport=require("passport");
const passportLocal=require("passport-local");
const User=require("./model/user");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

const port=3030;
// const mongoUrl="mongodb://localhost:27017/Airbnb";

app.listen(port,(req,res)=>{
    console.log(`App is running to port: ${port}`);
});

const db_url = process.env.MONGOATLAS_DB;

async function main() {
  await mongoose.connect(db_url);
}
main()
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ Connection error:", err));

const store=MongoStore.create({
    mongoUrl:db_url,
    crypto: {
    secret: process.env.secrets,
    touchAfter: 24 * 3600,
  }
})

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION",err);
})

const sessionOptions={
    store,
    secret: process.env.secrets,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOptions));
app.use(flash());

//using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//root page
app.get("/",(req,res)=>{
    res.redirect("/listing");
});

//middleware for alerts
app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.curUser=req.user;
  next();
});

app.get("/fake",async(req,res)=>{
    let fakeUser=new User({
        email:"syed@gmail.com",
        username:"syed"
    });
    const regUser=await User.register(fakeUser, "king");
    res.send(regUser);
})

app.get("/singup",async(req,res)=>{
    res.render("login.ejs");
})

//routes
app.use("/listing",listingsRoutes);
app.use("/listing/:id/reviews",reviewsRoutes);
app.use("/",usersRoutes);

//middlewares
app.all(/(.*)/,(req,res,next)=>{
    next(new expressError(404,"Page Not Found!"));
});
app.use((err,req,res,next)=>{
    let {status=500,message="some error"}=err;
    res.status(status).render("./error/error.ejs",{message});
});
