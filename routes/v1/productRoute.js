import express from "express";
import { createProductByAdmin, createProductBySeller, deleteProduct, deleteProductBySeller, getAllProducts, getProductById, getProductsBySeller, updateProduct, updateProductBySeller } from "../../controller/productController.js";
import { authoriseRoles, isAuthenticatedUser } from "../../middlewares/auth.js";
const productRouter=express.Router();

//admin
productRouter.post('/admin/addProduct',isAuthenticatedUser,authoriseRoles('admin') ,createProductByAdmin)
productRouter.put('/admin/updateProduct/:id',isAuthenticatedUser,authoriseRoles('admin') ,updateProduct)
productRouter.delete('/admin/deleteProduct/:id',isAuthenticatedUser,authoriseRoles('admin') ,deleteProduct)
//Seller
productRouter.post('/seller/createProductBySeller',isAuthenticatedUser,authoriseRoles('seller') ,createProductBySeller)
productRouter.put('/seller/updateProductBySeller/:id',isAuthenticatedUser,authoriseRoles('seller') ,updateProductBySeller)
productRouter.delete('/seller/deleteProductBySeller/:id',isAuthenticatedUser,authoriseRoles('seller') ,deleteProductBySeller)
productRouter.get('/seller/getProductsBySeller',isAuthenticatedUser,authoriseRoles('seller') ,getProductsBySeller)

productRouter.get('/getAllProducts',getAllProducts)
productRouter.get('/getProductById/:id',getProductById)





export default productRouter;