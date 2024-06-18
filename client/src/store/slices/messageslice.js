import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getmessageByconversationIdRoute } from "../../utils/routes";
import { sendMessageRoute } from "../../utils/routes";
import { fetchConversations } from "./conversationslice";
import { useDispatch } from "react-redux";




export const fetchMessages=createAsyncThunk('messages/fetchMessages',async(conversationId)=>{

    const response=await axios.get(getmessageByconversationIdRoute.replace(":conversationId",conversationId),{withCredentials:true});
    return response.data.data.messages;
})

export const sendMessage=createAsyncThunk('messages/sendMessage',async({conversationId,content},{ rejectWithValue })=>{

    try {
        const response= await axios.post(sendMessageRoute.replace(":conversationId",conversationId),{content},{withCredentials:true});
        const dispatch=useDispatch();
        dispatch(fetchConversations());
        return response.data.data.message;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const initialState={

    messages:[],
    status:'idle',
    error:null
}

const messageSlice=createSlice({
    name:'messages',
    initialState,
    reducers:{
        markAsRead(state,action){
            const messageId=action.payload;
            const message = state.messages.find(msg => msg._id === messageId);
            if (message) {
                message.read = true;
            }
            
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        removeMessage(state, action) {
            const messageId = action.payload;
            state.messages = state.messages.filter(msg => msg._id !== messageId);
        }

    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchMessages.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchMessages.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.messages = action.payload;

        })
        .addCase(fetchMessages.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        .addCase(sendMessage.fulfilled,(state,action)=>{

            state.messages.push(action.payload);
        })
    }
})

export const {markAsRead,addMessage,removeMessage}=messageSlice.actions;
export default messageSlice.reducer;