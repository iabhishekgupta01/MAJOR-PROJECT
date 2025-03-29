const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");



module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        
        req.flash("error","you must be logged in");
         return res.redirect("/login");
    }else{
        next();
    }
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params; 
    let list= await Listing.findById(id);
    if(!list || !list.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to make changes !");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// validate listing
module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(401,errMsg);
    }else{
        next();
    }
};

//validate reviews
module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        console.log(error.details);
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(401,errMsg);
        
    }else{
        next();
    }
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params; 
    let review= await Review.findById(reviewId);
    let list= await Listing.findById(id);
    if(!list || !review || !review.author.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to make changes !");
        return res.redirect(`/listings/${id}`);
    }
    next();
};