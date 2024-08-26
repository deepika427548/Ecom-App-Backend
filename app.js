import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import apirouter from "./routes/index.js";
import { connectDb } from "./config/connectDb.js";
import errorMiddelware from './middlewares/error.js'



const app=express();
dotenv.config({path:'./config/config.env'})
app.use(express.json());
app.use(cookieParser())
app.use('/api',apirouter);
app.use(errorMiddelware)
connectDb();



// console.log(process.env.PORT)

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on ${process.env.PORT}`);
    
})

//Handle Unhandled Promise Rejection

process.on('unhandledRejection',(err)=>{
    console.log(`ERROR:  ${err}`);
    console.log('shutting down server due to unhandled promise rejection');
    server.close(()=>{
        process.exit((1));
    })
    
})