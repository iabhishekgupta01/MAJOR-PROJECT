const mongoose=require("mongoose");
const Listing= require("../models/listing.js");
const initData=require("./data.js"); 

let mongo_url="mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("data base connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);
}

let initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>(
      {...obj, owner:"676ea6e0295d9680fea45580"}));
    await Listing.insertMany(initData.data);
    console.log("data was saved");
    
}

initDB();
