if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}


const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const port=8080;
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const methodOverride = require('method-override');
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
// const cookieParser=require("cookie-parser");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const Listing= require("./models/listing.js");
const initData=require("./init/data.js");

let initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>(
      {...obj, owner:"67e8039796677779396aa0b9"}));
    await Listing.insertMany(initData.data);
    console.log("data was saved");
    
}

app.get("addData",async(req,res)=>{
    initDB();
    res.send("data saved !!!!!");
})





// let mongo_url="mongodb://127.0.0.1:27017/wanderlust";

let dbUrl=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("Connected to Database");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600 ,
});


const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

// app.use(cookieParser("mysupersecretstring"));
app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});



// home route



app.use("/listings",listingRouter);      // listing-route-middleware
app.use("/listings/:id/reviews",reviewRouter);    // review-route-middleware
app.use("/",userRouter);         // user-route-middleware


// page not found- error handler
app.all("*",(req,res,next)=>{
    next(new ExpressError(401,"Page not found...!"));
});


//  all error handler middleware
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
});


app.listen(port,()=>{
    console.log("Server is listening at port:8080");
});