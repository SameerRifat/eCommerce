const app = require('./app');
const dotenv = require('dotenv');
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");

// handling uncaught exception
process.on("uncaughtException", (error)=>{
    console.log(`Error: ${error.message}`);
    console.log("Sutting down the server due to uncaughtException")

    process.exit(1);
})

// config
dotenv.config({path: "backend/config/config.env"});
// connecting to database
connectDatabase();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
})

// handling promise rejection
process.on("unhandledRejection", (error)=>{
    console.log(`Error: ${error.message}`);
    console.log("Sutting down the server due to Unhandled Promise Rejection")

    server.close(()=>{
        process.exit(1);
    })
})