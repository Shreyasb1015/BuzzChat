import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getConversationsByUserRoute } from "../../utils/routes";
import { createConversationRoute } from "../../utils/routes";



export const fetchConversations=createAsyncThunk('conversations/fetchConversations',async()=>{

    const response=await axios.get(getConversationsByUserRoute,{withCredentials:true});
    return response.data.data.conversations;
})

export const createConversation=createAsyncThunk('conversations/createConversation',async(newConversation,{rejectWithValue})=>{
    try {
        
        const response=await axios.post(createConversationRoute,newConversation,{withCredentials:true})
        return response.data;
    } catch (error) {
        
        return rejectWithValue(error.response.data)
    }
})

const initialState={

    conversations:[],
    status:'idle',
    error:null
}

const conversationSlice=createSlice({
    name:'conversations',
    initialState,
    reducers:{
        setLastMessage:(state,action)=>{
            const {conversationId,lastMessage}=action.payload;
            const conversation = state.conversations.find(conv => conv._id === conversationId);
            if (conversation) {
                conversation.lastMessage = lastMessage;
            }
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchConversations.pending,(state)=>{
            state.status='loading'
        })
        .addCase(fetchConversations.fulfilled,(state,action)=>{
            state.status='succeeded',
            state.conversations=action.payload;
        })
        .addCase(fetchConversations.rejected,(state,action)=>{

            state.status='failed'
            state.error=action.error.message
        })
        .addCase(createConversation.fulfilled,(state,action)=>{
            state.conversations.push(action.payload)
        })
    }

})

export const {setLastMessage}=conversationSlice.actions;

export default conversationSlice.reducer;