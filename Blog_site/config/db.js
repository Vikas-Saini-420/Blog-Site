//jshint esversion :8
const mongoose = require("mongoose");

const connectDB = async () => {
try{
    const conn = await mongoose.connect(process.env.MONGO_URI,{
 useNewUrlParser :true,
 useFindAndModify :false ,
 useCreateIndex : true,
 useUnifiedTopology: true,
    });
    console.log("Database connected");
} catch(err){
    console.error(err);
    process.exit(1);
}

};
module.exports = connectDB;