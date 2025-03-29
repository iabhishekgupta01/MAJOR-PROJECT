const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");


// signup page
router.route("/signup")
.get( wrapAsync( userController.renderSignUpForm))
.post( wrapAsync(userController.signUp ));

// login page
router.route("/login")
.get(wrapAsync( userController.renderLogInForm))
.post( saveRedirectUrl,
    passport.authenticate("local", {failureRedirect:'/login',failureFlash:true}) ,
    wrapAsync(userController.logIn ));


router.get("/logout",userController.logOut);


module.exports=router;