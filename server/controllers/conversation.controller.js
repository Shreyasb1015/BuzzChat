import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Conversation } from "../models/conversation.models.js";



const createConversation=asyncHandler(async(req,res)=>{

    const {isGroup,members,groupName}=req.body;
    if(!isGroup && (!members || members.length!=2))
    {
        throw new ApiError(400,"Private conversation must have 2 memebers");
    }

    const conversation=await Conversation.create({isGroup,members,groupName:isGroup?groupName:''});
    if(!conversation)
    {
        throw new ApiError(400,"Conversation not created");
    }

    return res.status(200).json(new ApiResponse(200,{conversation},"Conversation created successfully"));

})

const getConversationsByUser=asyncHandler(async(req,res)=>{

    const userId=req.user?._id;

    const conversations=await Conversation.find({members:userId}).populate("members","username email profilePicture").sort({updatedAt:-1});
    if(!conversations)
    {
        throw new ApiError(400,"Conversations not found");
    }

    return res.status(200).json(new ApiResponse(200,{conversations},"Conversations found successfully"));
})

const updateConversion=asyncHandler(async(req,res)=>{

    const conversationId=req.params.conversationId;
    const {groupName,members}=req.body;
    if(!groupName && !members)
    {
        throw new ApiError(400,"GroupName or members is required");
    }
    const conversation=await Conversation.findById(conversationId);
    if(!conversation)
    {
        throw new ApiError(400,"Conversation not found");
    }
    if(members)
    {
        conversation.members.push(...members);
    }
    if(groupName && conversation.isGroup)
    {
        conversation.groupName=groupName;
    }
    await conversation.save();
    return res.status(200).json(new ApiResponse(200,{conversation},"Conversation updated successfully"));

})

const deleteConversation=asyncHandler(async(req,res)=>{

    const conversationId=req.params.conversationId;
    const conversation=await Conversation.findById(conversationId);
    if(!conversation)
    {
        throw new ApiError(400,"Conversation not found");
    }

    const deletedConversation=await Conversation.findByIdAndDelete(conversationId);
    if(!deletedConversation)
    {
        throw new ApiError(400,"Conversation not deleted");
    }

    return res.status(200).json(new ApiResponse(200,{},"Conversation deleted successfully"));

})


const updateLastMessage = asyncHandler(async (conversationId, message) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    conversation.lastMessage = {
        content: message.content,
        sender: message.sender,
        timestamp: message.createdAt,
    };

    await conversation.save();
});


export {createConversation,getConversationsByUser,updateConversion,deleteConversation,updateLastMessage}