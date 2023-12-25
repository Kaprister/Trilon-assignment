const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/myDatabase'
    //     ,{
    //     useNewUrlParser : true,
    //     useUnifiedTopology : true,
    // }
    )
    .then( () => {
        console.log("DATABASE CONNECTED SUCCESSFULLY !! ")
    })
    .catch( (error) => {
        console.log("ERROR FACED IN DATABASE CONNECTION !!");
        console.error(error);
        console.log("MongoDB Connection Details:", mongoose.connection);
        process.exit(1);
    })
}; 