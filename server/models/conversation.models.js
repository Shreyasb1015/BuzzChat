import mongoose,{Schema} from "mongoose";

const conversationSchema=new Schema({

    isGroup:{
        type:Boolean,
        default:false,
    },  
    members:[{
        type:Schema.Types.ObjectId,
        ref:"User",
    }],
    groupName:{
        type:String,
    },
    lastMessage:{
        content:{
            type:String
        },
        sender:{
            type:Schema.Types.ObjectId,
            ref:"User",
        },
        timestamp:{
            type:Date,
            default:Date.now
        }
    }

},{timestamps:true});

export const Conversation=mongoose.model("Conversation",conversationSchema);