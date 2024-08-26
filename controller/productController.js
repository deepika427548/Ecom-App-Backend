import productModel from "../Models/productModel.js";
import errorHandler from "../utils/errorHandler.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ApiFilters from "../utils/apiFilters.js";

//get all products >>>> http://localhost:4444/api/v1/product/getAllProducts
export const getAllProducts=async(req,res)=>{
const rePerPage=4;
    //create an instance of apiFilter and call search fuction
    console.log(req.query);
    const apiFilters=new ApiFilters(productModel,req.query).search().filter();

    let product= await apiFilters.query;
    const filteredProductCount=product.length
      
    apiFilters.pagination(rePerPage);
    product=await apiFilters.query.clone();
    

    // const products=await productModel.find();
//    console.log("user:",req.user);
   
    res.status(200).json({filteredProductCount,product,})
}


//Admin creates new products  http://localhost:4444/api/v1/product/admin/addProduct
export const createProductByAdmin=asyncHandler(async(req,res)=>{

    req.body.user=req.user._id  //assign the 'user' of productModel  to the id of current user who initiate the request

    const newProduct=await productModel.create(req.body);


    res.status(200).json({message:'new product has been created',newProduct,})
})

// get single product ... http://localhost:4444/api/v1/product/getProductById/:id

export const getProductById=asyncHandler(async(req,res,next)=>{

    const product=await productModel.findById(req.params.id);

    if(!product){
        // console.log("product not found");
        // return res.status(404).json({error:"Product Not Found"})
        return next(new errorHandler("product not found",400))
       
    }

    res.status(200).json({product,})
})

// update theproduct ... http://localhost:4444/api/v1/product/admin/updateProduct/:id

export const updateProduct=asyncHandler(async(req,res,next)=>{

    let product=await productModel.findById(req.params.id);

    if(!product){
        // console.log("product not found");
        // return res.status(404).json({error:"Product Not Found"})

        return next(new errorHandler("product not found",400))
       
    }

    product= await productModel.findByIdAndUpdate(req.params.id,req.body,{new:true})


    res.status(200).json({message:"product updated",product,})
})

// delete theproduct ... http://localhost:4444/api/v1/product/admin/deleteProduct/:id

export const deleteProduct=asyncHandler(async(req,res,next)=>{

    let product=await productModel.findById(req.params.id);

    if(!product){
        // console.log("product not found");
        // return res.status(404).json({error:"Product Not Found"})
        return next(new errorHandler("product not found",400))
       
    }

    await product.deleteOne();


    res.status(200).json({message:'the product is deleted successfully'})
})

//                >>>>>>>>>>>>>>>>>>>>>> SELLER <<<<<<<<<<<<<<<<<<<<<<<<<<<

// Create product by seller api/v1/product/seller/createProductBySeller


export const createProductBySeller=asyncHandler(async(req,res)=>{

    req.body.user=req.user._id  //assign the 'user' of productModel  to the id of current user who initiate the request

    const newProduct=await productModel.create(req.body);


    res.status(200).json({message:'new product has been created',newProduct,})
})

// Update product by seller api/v1/product/seller/updateProductBySeller


export const updateProductBySeller=asyncHandler(async(req,res,next)=>{

    let product=await productModel.findById(req.params.id);

    if(!product){
        return next(new errorHandler("product not found",400))
       
    }
    //check if the loggedin user is the owner of the product

    if(product.user.toString() !=req.user._id.toString() && req.user.role != 'admin'){
        return next(new errorHandler("Not authorized to update this product", 403))
    }
    //update the product

    const updatedProduct=await productModel.findByIdAndUpdate(req.params.id,req.body,{new:true})


    res.status(200).json({message:"product updated by seller",updatedProduct,})
})


// Seller deletes their own product

export const deleteProductBySeller = asyncHandler(async (req, res, next) => {

    
    const product = await productModel.findById(req.params.id);

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    // Check if the logged-in user is the owner of the product
    if (product.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new errorHandler("Not authorized to delete this product", 403));
    }

    // Delete the product
    await product.deleteOne();

    res.status(200).json({ message: 'The product has been deleted successfully' });
});

// Get all products created by the logged-in seller

export const getProductsBySeller = asyncHandler(async (req, res, next) => {
    
    
    if (req.user.role !== 'seller') {
        return next(new errorHandler("Only sellers can access their products", 403));
    }

    // Find all products created by the logged-in user
    const products = await productModel.find({ user: req.user._id });

    // Check if products are found
    if (products.length === 0) {
        return next(new errorHandler("No products found for this seller", 404));
    }

    res.status(200).json({ success: true, products });
});