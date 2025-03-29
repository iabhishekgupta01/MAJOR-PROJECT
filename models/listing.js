const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");


let listingSchema= new mongoose.Schema({
    title:{
        type:String,
        
    },
    description:{
        type:String
    },
    image:{
        url:String,
        filename:String
        // type:String,
        // default:"https://images.unsplash.com/photo-1460627390041-532a28402358?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set:(v)=> v===""?
        //         "https://images.unsplash.com/photo-1460627390041-532a28402358?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        //         :v           
    },
    price:{
        type:Number,
        
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing.reviews.length){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
});


let Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;