import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Message} from "../models/message.models.js";
import { updateLastMessage } from "./conversation.controller.js";


const sendMessage=asyncHandler(async(req,res)=>{

    const conversationId=req.params.conversationId;
    const {content}=req.body;
    const sender=req.user?._id;
    if(!content){
        throw new ApiError(400,"Content is required");
    }
    const message=await Message.create({conversationId,sender,content});
    if(!message)
    {
        return res.status(400).json({success:false,message:"Message not sent"});
    }
    await updateLastMessage(conversationId,message);
    return res.status(200).json(new ApiResponse(200,{message},"Message sent successfully"));

})

const getmessageByconversationId=asyncHandler(async(req,res)=>{

    const conversationId=req.params.conversationId;
    const messages=await Message.find({conversationId}).populate("sender","username email profilePic");
    if(!messages)
    {
        return res.status(400).json({success:false,message:"Messages not found"});
    }
    return res.status(200).json(new ApiResponse(200,{messages},"Messages found successfully"));
})

const updateMessage=asyncHandler(async(req,res)=>{

    const messageId=req.params.messageId;
    const {content}=req.body;
    const message=await Message.findById(messageId);
    if(!message)
    {
        return res.status(400).json({success:false,message:"Message not found"});
    }
    if(message.sender.toString()!==req.user._id.toString())
    {
        return res.status(401).json({success:false,message:"You are not authorized to update this message"});
    }
    message.content=content;
    await message.save();
    return res.status(200).json(new ApiResponse(200,{message},"Message updated successfully"));
})

const deleteMessage=asyncHandler(async(req,res)=>{

    const messageId=req.params.messageId;
    const message=await Message.findById(messageId);
    if(!message)
    {
        throw new ApiError(400,"Message not found");
    }
    if(message.sender.toString()!==req.user._id.toString())
    {
        return res.status(401).json({success:false,message:"You are not authorized to delete this message"});           

    }
    const deletemsg=await Message.findByIdAndDelete(messageId);
    if(!deletemsg)
    {
        return res.status(400).json({success:false,message:"Message not deleted"});
    }

    return res.status(200).json(new ApiResponse(200,{},"Message deleted successfully"));
})

const markAsRead=asyncHandler(async(req,res)=>{

    const messageId=req.params.messageId;
    const userId=req.user?._id;

    const message=await Message.findById(messageId);
    if(!message)
    {
        throw new ApiError(400,"Message not found");
    }
    if(!message.readBy.includes(userId))
    {
        message.readBy.push(userId);
        await message.save();

    }
    return res.status(200).json(new ApiResponse(200,{message},"Message marked as read successfully"));  

})
export {sendMessage,getmessageByconversationId,updateMessage,deleteMessage,markAsRead}