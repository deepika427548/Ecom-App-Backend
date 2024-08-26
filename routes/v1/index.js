import express from "express";
import userRouter from "./userRoute.js";
import productRouter from "./productRoute.js";
import orderRouter from "./orderRoute.js";

const v1router=express.Router();

v1router.use('/user',userRouter)
v1router.use('/product',productRouter)
v1router.use('/order',orderRouter)




export default v1router;