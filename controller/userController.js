

import userModel from "../Models/userModel.js";

import asyncHandler from "../middlewares/asyncHandler.js";
import errorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";

//Register new User=>>>>>>>>>>>>>>>>>>>..>/api/v1/user/signupUser
export const signupUser=asyncHandler(async(req,res,next)=>{

    const{name,email,password}=req.body;

      const newUser=await userModel.create({name,email,password})


      sendToken(newUser,201,"registered",res)
})

//Login User=>>>>>>>>>>>>>>>>>>>/api/v1/user/loginUser
export const LoginUser=asyncHandler(async(req,res,next)=>{

    const{email,password}=req.body;

    if(!email || !password){
       
        return next(new errorHandler("email and password are required",400));

    }

    const user=await userModel.findOne({email}).select("+password");

    if(!user){
        return next(new errorHandler("invalid user or passwird",401));
    }

    //check if the password is correct
     
    const isPasswordMatched=await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new errorHandler("invalid user or passwird",401));
    }

    sendToken(user,200,"loggedin",res)

    //   const token=use

    //   res.status(200).json({message:"successfully loggedin",token})
})

//LogOut User=>>>>>>>>>>>>>>>>/api/v1/user/logoutUser
export const LogoutUser=asyncHandler(async(req,res,next)=>{
    const user = req.user;

   //set the cookie null
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({message:"loggedOut",})

})

//Forgot password=>>>>>>>>>>>>>/api/v1/user/password/forgot(not completed!!!!!!)
export const forgotPassword=asyncHandler(async(req,res,next)=>{

    const user=await userModel.findOne({email:req.body.email})

    if(!user){
        return next(new errorHandler("user not found",404));
    }
//get reset password token
    const resetToken=user.getResetPasswordToken();
    await user.save();

    //create reset password URL

})

//Get current User Profile >>>>>>>>>>>>>>>/api/v1/user/getUserProfile

export const getUserProfile=asyncHandler(async(req,res,next)=>{

    const user=await userModel.findById(req?.user?._id);

    res.status(200).json({
        user,
    })

})


//Update Password =>>>>>>>>>>>>>>>>>>>>>>> /api/v1/user/UpdatePassword

export const updatePassword=asyncHandler(async(req,res,next)=>{

    const user=await userModel.findById(req?.user?._id).select("+password");

  //chech prev password

  const isPasswordMatched=await user.comparePassword(req.body.oldPassword);

  if(!isPasswordMatched){
    return next(new errorHandler("Old password is incorrect",400));

  }

  user.password=req.body.password;
  user.save();


    res.status(200).json({
        message:"password updated successfully"
    })

})

//Update User Profile >>> /api/v1/user/UpdateUserProfile

export const updateProfile=asyncHandler(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email
    }

    const user=await userModel.findByIdAndUpdate(req.user._id,newUserData,{new:true})

    res.status(200).json({
        message:"Profile updated successfully",user,
    })
})


//Get all users=ADMIN >>api/v1/user/admin/getAllUsers
export const getAllUsers=asyncHandler(async(req,res,next)=>{
const users=await userModel.find();

res.status(200).json({users,

})
})

//Get a specific user details=ADMIN >>api/v1/user/admin/getUserDetails/:id
export const getUserDetails=asyncHandler(async(req,res,next)=>{
    const user=await userModel.findById(req.params.id);
   
    if(!user){

        return next(new errorHandler(`User not found with id:${req.params.id},404`))
    }

    
    res.status(200).json({user,
    
    })
    })



    //Update User by ADMIN  >>> /api/v1/user/admin/UpdateUser/:id

export const updateUser=asyncHandler(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user=await userModel.findByIdAndUpdate(req.user._id,newUserData,{new:true})

    res.status(200).json({
        message:"user data updated by admin successfully",user,
    })
})

//Delete user details=ADMIN >>api/v1/user/admin/deleteUser/:id
export const deleteUser=asyncHandler(async(req,res,next)=>{
    const user=await userModel.findById(req.params.id);
   
    if(!user){

        return next(new errorHandler(`User not found with id:${req.params.id},404`))
    }
//have to delete the profile pic from cloudinary????



    await user.deleteOne()

    
    res.status(200).json({message:'user deleted successfully'
    
    })
    })


    




