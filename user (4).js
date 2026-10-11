const express = require("express");
const router = express.Router();
const User=require("../model/user");
const passport=require("passport");
const {saveRedirectUrl}=require("../utils/middleware")

//controller folder
const usersController=require("../controllers/users");

router.get("/signup", usersController.renderSingup);

router.post("/signup", usersController.singup);

router.get("/login", usersController.renderLogin);

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
    usersController.login
);

router.get("/logout",usersController.logout)
module.exports = router;
