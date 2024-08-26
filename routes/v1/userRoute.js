import express from "express";
import {deleteUser, getAllUsers, getUserDetails, getUserProfile, LoginUser, LogoutUser, signupUser, updatePassword, updateProfile, updateUser }from "../../controller/userController.js"
import { authoriseRoles, isAuthenticatedUser } from "../../middlewares/auth.js";

const userRouter=express.Router();

userRouter.post('/signupUser',signupUser)
userRouter.post('/loginUser',LoginUser)
userRouter.get('/logoutUser',LogoutUser)

userRouter.get('/getUserProfile',isAuthenticatedUser,getUserProfile);
userRouter.put('/updatePassword',isAuthenticatedUser,updatePassword);
userRouter.put('/updateUserProfile',isAuthenticatedUser,updateProfile);

userRouter.get('/admin/getAllUsers',isAuthenticatedUser,authoriseRoles('admin'),getAllUsers)
userRouter.get('/admin/getUserDetails/:id',isAuthenticatedUser,authoriseRoles('admin'),getUserDetails)

userRouter.put('/admin/updateUser/:id',isAuthenticatedUser,authoriseRoles('admin'),updateUser)
userRouter.delete('/admin/deleteUser/:id',isAuthenticatedUser,authoriseRoles('admin'),deleteUser)
export default userRouter