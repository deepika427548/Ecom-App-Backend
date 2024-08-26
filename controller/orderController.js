import errorHandler from "../utils/errorHandler.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ApiFilters from "../utils/apiFilters.js";
import orderModel from "../Models/orderModel.js";
import productModel from "../Models/productModel.js";



// Create new order >>>>>>/api/v1/order/createNewOrder

export const createNewOrder=asyncHandler(async(req,res,next)=>{

    const { shippingInfo,
           orderedItems,
           paymentMethod,
           paymentInfo,
           itemsPrice,
           taxAmount,
           shippingAmount,
           totalAmount}=req.body;

           const order=await orderModel.create({
            shippingInfo,
            orderedItems,
            paymentMethod,
            paymentInfo,
            itemsPrice,
            taxAmount,
            shippingAmount,
            totalAmount,
            user:req.user._id
           })


    res.status(200).json({message:"Order created successfully",order,})

    })


    //Get order details of loggedin user >>>>>>>>/api/v1/order/getOrderDetails

    export const MyOrder=asyncHandler(async(req,res,next)=>{
       
        const orders=await orderModel.find({user:req.user._id});
        console.log({user:req.user._id});
        
    
        // if(!order){
        //     return next(new errorHandler("No Order Found with this id",404))
        // }
    
        res.status(200).json({success:true,orders,})
    
        })


    //Get order details of a specific order >>>>>>>>/api/v1/order/getOrderDetails

    export const getOrderDetails=asyncHandler(async(req,res,next)=>{
       
    const order=await orderModel.findById(req.params.id).populate('user');

    if(!order){
        return next(new errorHandler("No Order Found with this id",404))
    }

    res.status(200).json({success:true,order,})

    })

      //Get all order details(ADMIN)>>>>>>>>/api/v1/order/admin/getallOrders

      export const getAllOrders=asyncHandler(async(req,res,next)=>{
       
        const orders=await orderModel.find()
    
        
        res.status(200).json({orders,})
    
        })

// Update order-ADMIN>>>>>>>>/api/v1/order/admin/updateOrder/:id

export const updateOrder=asyncHandler(async(req,res,next)=>{

    const order=await orderModel.findById(req.params.id);

    if(!order){
        return next(new errorHandler("No order find with this id",404))
    }

    if(order?.orderStatus === "Delivered"){
        return next(new errorHandler("order is already",404))
    }

             //Update product stock after "delivered"

 order?.orderedItems?.forEach(async(item)=>{
    const product=await productModel.findById(item?.product?.toString())

if(!product){
    return next(new errorHandler("No product find with this id",404))
}
product.stock=product.stock - item.quantity;
await product.save({validateBeforeSave:false})

 })
 order.orderStatus=req.body.status
 order.deliveredAt=Date.now()

 await order.save()

 res.status(200).json({success:true,})

})

//delete order(ADMIN)>>>>>>>>/api/v1/order/admin/deleteOrder

export const deleteOrder=asyncHandler(async(req,res,next)=>{
       
    const order=await orderModel.findById(req.params.id);

    if(!order){
        return next(new errorHandler("No order find with this id",404))
    }

    await order.deleteOne();

    
    res.status(200).json({message:"order deleted successfully",})

    })