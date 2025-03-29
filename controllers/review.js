const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async(req,res)=>{

    let listing=await Listing.findById(req.params.id);

    let review1= new Review(req.body.review);
    review1.author=req.user._id;
    listing.reviews.push(review1);

    await review1.save();
    await listing.save();
    req.flash("success","review added successfully");

    res.redirect(`/listings/${req.params.id}`);
    
};

module.exports.destroyReview= async(req,res)=>{
    let{id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted successfully");

    res.redirect(`/listings/${id}`);
};