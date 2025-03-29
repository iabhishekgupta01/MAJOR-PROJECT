const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
    let allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let list= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!list){
        req.flash("error","listing does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list});
};

module.exports.createListing=async (req, res) => {
    let filename=req.file.filenamee;
    let url=req.file.path;
    let listing = req.body.listing;
    let list = new Listing(listing);
    list.owner=req.user._id;
    list.image={url,filename};

    await list.save();
    req.flash("success","listing added successfully");
    res.redirect("/listings");

};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let list= await Listing.findById(id);
    if(!list){
        req.flash("error","listing does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{list});
};

module.exports.updateListing=async (req,res)=>{
    let listing = req.body.listing;
    // let newlist = new Listing(listing);
    let {id}=req.params;

    
    if(req.file){
        let filename=req.file.filename;
        let url=req.file.path;
        listing.image={url,filename};
    }else{
        let list=await Listing.findById(id);
        let filename=list.image.filename;
        let url=list.image.url;
        listing.image={url,filename};
    }
    
    await Listing.findByIdAndUpdate(id,listing);
    req.flash("success","listing updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let result=await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully");
    res.redirect("/listings");
};