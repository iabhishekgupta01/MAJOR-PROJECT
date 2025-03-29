const User=require("../models/user.js");
const passport=require("passport");

module.exports.renderSignUpForm=async(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        let registeredUser=await User.register({username,email},password);

        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust !");
            res.redirect("/listings");
        });


    }catch(err){

        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogInForm=async(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.logIn=async(req,res)=>{
    
    req.flash("success","welcome to wanderlust");
    let redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);;
};

module.exports.logOut=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out !");
        res.redirect("/listings");
    });
};