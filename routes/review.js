const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {isReviewAuthor,isLoggedIn,validateReview}=require("../middleware.js");

const reviewController=require("../controllers/review.js");


// Add-review           here   : isloggedin  is showing problem by hoppscotch so solve it....
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

//Delete-review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports=router;