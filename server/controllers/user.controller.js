import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cookieOptions={
    httpOnly:true,
    secure:true,
    sameSite: 'none',
   
}

const generateAccessTokenAndRefreshToken=async(id)=>{
    try {
        const user=await User.findById(id)
        if(!user)
            {
                throw new ApiError(404,"User not found")
            }
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
        
    } catch (error) {
        
        throw new ApiError(500,"Token generation failed due to : " +error.message)
    }
}

const generateRandomProfilePicture = () => {
    const profilePicturesFolder = path.join(__dirname, 'public/profile-pictures'); 
    if (!fs.existsSync(profilePicturesFolder)) {
        throw new Error("Profile pictures folder does not exist");
    }

    const files = fs.readdirSync(profilePicturesFolder);
    if (files.length === 0) {
        throw new Error("No profile pictures available");
    }

    const randomIndex = Math.floor(Math.random() * files.length);
    return `/profile-pictures/${files[randomIndex]}`;
};
const registerUser=asyncHandler(async(req,res)=>{

    const {username,email,password}=req.body;
    if(!username || !email || !password){
        throw new ApiError(400,"Please provide all fields")
    }
    const existUser=await User.findOne({email})
    if(existUser)
    {
        return res.status(400).json({message:"User already exists"})

    }
    const profilePicture=generateRandomProfilePicture()
    const user=await User.create({username,email,password,profilePicture})
    if(!user)
    {
        throw new ApiError(500,"User creation failed")
    }
    const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user?._id)
    const userInfo=await User.findById(user._id).select("-password -refreshToken")
    return res.status(201).cookie("accessToken",accessToken,cookieOptions).cookie('refreshToken',refreshToken,cookieOptions).json(new ApiResponse(201,{userInfo},"User created successfully"))
})

const loginUser=asyncHandler(async(req,res)=>{

    const {email,password}=req.body;
    if(!email || !password){
        throw new ApiError(400,"Please provide all fields")
    }
    const user=await User.findOne({email})
    if(!user)
        {
            throw new ApiError(404,"User not found")
        }
    const isPasswordCorrect=await user.matchPassword(password)  
    if(!isPasswordCorrect)
        {
            return res.status(401).json({message:"Invalid credentials"})
        }
    const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user?._id)
    const loginInfo=await User.findById(user._id).select("-password -refreshToken")
    return res.status(200).cookie("accessToken",accessToken,cookieOptions).cookie('refreshToken',refreshToken,cookieOptions).json(new ApiResponse(200,{loginInfo},"User logged in successfully"))


})

const logoutUser=asyncHandler(async(req,res)=>{

    await User.findByIdAndUpdate(req.user?._id,{$unset:{refreshToken:1}},{new:true}) 
    return res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse(200,{},"User logged out successfully"));
})


const updateProfile=asyncHandler(async(req,res)=>{

    const {username,email}=req.body;
    if(!username || !email){
        throw new ApiError(400,"Please provide all fields")
    }
    const existuser=await User.findById(req.user?._id)
    if(!existuser)
    {
        throw new ApiError(404,"User not found")
    }
    const user=await User.findByIdAndUpdate(req.user?._id,{username,email},{new:true})
    if(!user)
    {
        throw new ApiError(500,"User update failed")
    }
    return res.status(200).json(new ApiResponse(200,{user},"User updated successfully"))

})

const changePassword=asyncHandler(async(req,res)=>{

    const {oldPassword,newPassword}=req.body;
    if(!oldPassword || !newPassword){
        throw new ApiError(400,"Please provide all fields")
    }
    const user=await User.findById(req.user?._id)
    const isMatch=await user.matchPassword(oldPassword)
    if(!isMatch)
    {
        throw new ApiError(401,"Invalid credentials")
    }
    user.password=newPassword;
    await user.save({validateBeforeSave:false})

    return res.status(200).json(new ApiResponse(200,{},"Password changed successfully"))

})

const getAllUsers=asyncHandler(async(req,res)=>{
   
    const users=await User.find({_id:{$ne:req.user?._id}}).select("-password -refreshToken")
    return res.status(200).json(new ApiResponse(200,{users},"Users fetched successfully"))

})


export {registerUser,loginUser,updateProfile,changePassword,logoutUser,getAllUsers}
